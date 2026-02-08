import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Immutable view type for public API
  public type Message = {
    author : Text;
    content : Text;
    timestamp : Int;
  };

  // Internal persistent chat state
  type PersistentChat = {
    chatId : Nat;
    title : Text;
    messages : List.List<Message>;
    creator : Principal;
  };

  // API type for returning immutable chat snapshots
  public type ChatView = {
    chatId : Nat;
    title : Text;
    messages : [Message];
    creator : Principal;
  };

  public type MessageInput = {
    author : Text;
    content : Text;
  };

  public type ChatSummary = {
    chatId : Nat;
    title : Text;
    creator : Principal;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextChatId = 0;

  let chats = Map.empty<Nat, PersistentChat>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Chat functionality
  public func getChatbotReply(prompt : Text) : async Text {
    Runtime.trap(
      "Explicit sexual content, fetish requests and non-consensual content are not allowed on the Internet Computer platform. Please refrain from posting such content in the future. This incident has been flagged but no further action will be taken if there are no repeated violations."
    );
  };

  public query ({ caller }) func getUserChats() : async [ChatSummary] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access chat history");
    };

    chats.filter(func(_id, chat) { Principal.equal(chat.creator, caller) }).values().map(
      func(chat) {
        {
          chatId = chat.chatId;
          title = chat.title;
          creator = chat.creator;
        };
      }
    ).toArray();
  };

  public shared ({ caller }) func getChat(chatId : Nat) : async ?ChatView {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access chats");
    };

    switch (chats.get(chatId)) {
      case (?chat) {
        if (Principal.equal(chat.creator, caller)) {
          ?{
            chatId = chat.chatId;
            title = chat.title;
            messages = chat.messages.toArray();
            creator = chat.creator;
          };
        } else {
          Runtime.trap("Unauthorized: Cannot access chat owned by another user");
        };
      };
      case (null) {
        Runtime.trap("Chat not found");
      };
    };
  };

  public shared ({ caller }) func createChat(title : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create chats");
    };

    let chatId = nextChatId;
    nextChatId += 1;

    let newChat : PersistentChat = {
      chatId;
      title;
      messages = List.empty<Message>();
      creator = caller;
    };

    chats.add(chatId, newChat);
    chatId;
  };

  public shared ({ caller }) func addMessage(chatId : Nat, message : MessageInput, timestamp : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add messages");
    };

    switch (chats.get(chatId)) {
      case (?chat) {
        if (not Principal.equal(chat.creator, caller)) {
          Runtime.trap("Unauthorized: Cannot add message to chat of another user");
        };

        let newMessage : Message = {
          author = message.author;
          content = message.content;
          timestamp;
        };

        chat.messages.add(newMessage);
      };
      case (null) {
        Runtime.trap("Chat not found");
      };
    };
  };

  public shared ({ caller }) func deleteChat(chatId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete chats");
    };

    switch (chats.get(chatId)) {
      case (?chat) {
        if (not Principal.equal(chat.creator, caller)) {
          Runtime.trap("Unauthorized: Cannot delete chat of another user");
        };
        chats.remove(chatId);
      };
      case (null) {
        Runtime.trap("Chat not found");
      };
    };
  };
};
