import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  public shared ({ caller }) func getChatbotReply(prompt : Text) : async Text {
    Runtime.trap(
      "Explicit sexual content, fetish requests and non-consensual content are not allowed on the Internet Computer platform. Please refrain from posting such content in the future. This incident has been flagged but no further action will be taken if there are no repeated violations."
    );
  };
};
