export const FORM_COPY = {
  steps: {
    service: {
      heading: "What do you need help with?",
      subheading: "Select the primary service you require so we can prepare before we call.",
      buttonLabel: "Continue to details"
    },
    situation: {
      heading: "What is your current situation?",
      subheading: "This helps us understand the urgency and assign the right expert.",
      buttonLabel: "Continue to contact details"
    },
    contact: {
      heading: "Where should we reach you?",
      subheading: "We will contact you within one business day.",
      buttonLabel: "Request a consultation"
    }
  },
  fields: {
    name: {
      label: "Full Name",
      placeholder: "e.g. Ramesh Kumar"
    },
    company: {
      label: "Company Name (Optional)",
      placeholder: "e.g. Acme Tech Private Limited"
    },
    phone: {
      label: "Mobile Number",
      placeholder: "9876543210"
    },
    email: {
      label: "Email Address",
      placeholder: "ramesh@example.com"
    },
    description: {
      label: "Briefly describe your requirements",
      placeholder: "Mention any specific deadlines, notices, or turnover figures..."
    }
  },
  errors: {
    serviceRequired: "Select a service from the list to proceed.",
    situationRequired: "Select your current situation to proceed.",
    nameRequired: "Enter your full name.",
    phoneInvalid: "Enter a 10-digit mobile number, like 9876543210.",
    emailInvalid: "Enter a valid email address, like ramesh@example.com.",
    descriptionTooShort: "Provide a few more details so we can assist you better.",
    consentRequired: "Check the box to agree to our privacy policy before submitting."
  },
  consent: "I agree to let Amit Modi & Co. store this information to contact me regarding my inquiry. My details will never be sold or shared with third parties.",
  messages: {
    successToast: "Your consultation request has been successfully submitted.",
    thankYouHeading: "We have received your request.",
    thankYouBody: "Our team is reviewing your details. We will call you within one business day to discuss your compliance requirements. A confirmation email has been sent to your inbox.",
    failureMessage: "We could not submit your request due to a technical error. Please call us directly at +91 94145 04617 to book your consultation."
  },
  situations: [
    { id: "routine", label: "I need to start regular compliance filings." },
    { id: "notice", label: "I've received a notice from the tax department." },
    { id: "deadline", label: "A statutory filing deadline is approaching." },
    { id: "registration", label: "I need to register a new business or get a new license." },
    { id: "error", label: "I made a mistake in my previous filings and need to fix it." }
  ],
  confirmationEmail: {
    subject: "We have received your consultation request",
    body: "Thank you for reaching out to Amit Modi & Co.\n\nOur team is currently reviewing your compliance requirements. A dedicated tax professional will call you within one business day to discuss your case and provide an initial diagnostic review.\n\nTo make our call as productive as possible, please keep your recent tax filings, notices (if any), and basic financial ledgers accessible.\n\nIf your matter is extremely urgent and requires immediate intervention, please call us directly at +91 94145 04617.\n\nWe look forward to speaking with you.\n\nRegards,\nThe Amit Modi & Co. team"
  }
};
