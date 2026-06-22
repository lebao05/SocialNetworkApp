export function getSystemMessagePreview(message) {
  const payload = (() => {
    try { return message.payload ? JSON.parse(message.payload) : null; } catch { return null; }
  })();

  const numType = typeof message.systemMessageType === "number"
    ? message.systemMessageType
    : parseInt(message.systemMessageType, 10);

  switch (numType) {
    case 1: // ConversationImageUpdated
      return message.senderName !== "System"
        ? `${message.senderName} updated the group photo`
        : "Group photo was updated";
    case 2: { // ConversationNameUpdated
      const oldVal = payload?.oldValue;
      const newVal = payload?.newValue;
      const who = message.senderName !== "System" ? `${message.senderName} ` : "";
      if (oldVal && newVal) return `${who}changed the group name from "${oldVal}" to "${newVal}"`;
      if (newVal) return `${who}set the group name to "${newVal}"`;
      return `${who}updated the group name`;
    }
    case 3: { // ConversationThemeUpdated
      const newVal = payload?.newValue;
      const who = message.senderName !== "System" ? `${message.senderName} ` : "";
      if (newVal) return `${who}changed the theme to "${newVal}"`;
      return `${who}changed the theme`;
    }
    case 4: { // ConversationDefaultReactionUpdated
      const newVal = payload?.newValue;
      const who = message.senderName !== "System" ? `${message.senderName} ` : "";
      return `${who}set the default reaction to ${newVal || "none"}`;
    }
    case 10: { // MemberAdded
      const newMemberUserName = payload?.newMemberUserName;
      return `${newMemberUserName || message.senderName} was added to the group`;
    }
    case 11: { // MemberRemoved
      const removedUserName = payload?.removedUserName;
      return `${removedUserName || message.senderName} was removed from the group`;
    }
    case 12: { // MemberLeft
      const leftUserName = payload?.leftUserName;
      return `${leftUserName || message.senderName} left the group`;
    }
    case 13: { // MemberRoleChanged
      const targetUserName = payload?.targetUserName;
      const newRole = payload?.newRole;
      return `${targetUserName || message.senderName} was promoted to ${newRole}`;
    }
    default:
      return "Group settings were updated";
  }
}
