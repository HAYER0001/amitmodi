export const CONTACT_ROUTING = {
  situations: {
    routine: "ROUTINE",
    notice: "URGENT_NOTICE",
    deadline: "URGENT_DEADLINE",
    registration: "NEW_REGISTRATION",
    error: "RECTIFICATION"
  },
  getSubjectPrefix: (situationId: string, serviceSlug: string) => {
    const urgency = CONTACT_ROUTING.situations[situationId as keyof typeof CONTACT_ROUTING.situations] || "INQUIRY";
    const service = serviceSlug.toUpperCase().replace(/-/g, '_');
    return `[${urgency}] [${service}]`;
  }
};
