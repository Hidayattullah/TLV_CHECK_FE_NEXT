export type Permission = "read" | "edit" | "delete";
export type Module = "members" | "checkin" | "prayers" | "questions";
export type RfidType = "Card" | "Tag" | "Stiker";
export type Gender = "Laki-laki" | "Perempuan";

export type Member = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  joinedDate: string;
  isActive: boolean;
  phoneNumber: string;
  isVerified: boolean;
  address: string;
  dateOfBirth: string;
  gender: Gender;
  permissions: Record<Module, Permission[]>;
  rfid: {
    id: string | null;
    type: RfidType | null;
  };
};

// Type for adding a new member, without system-generated fields like id, joinedDate etc.
export type NewMember = Omit<Member, "id" | "joinedDate" | "isActive" | "isVerified" | "avatarUrl" | "permissions" | "rfid">;

// Check-in types
export type Attendee = {
  id: string;
  name: string;
  checkinTime: string;
  checkinMethod: "Barcode" | "RFID";
};

export type CheckInEvent = {
  id: string;
  eventName: string;
  eventDate: string;
  isActive: boolean;
  attendees: Attendee[];
  activationType?: 'manual' | 'timer';
  deactivationTimer?: ReturnType<typeof setTimeout>;
  timerEndsAt?: number;
};
