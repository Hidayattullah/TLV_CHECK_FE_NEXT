
// File ini mendefinisikan semua endpoint API yang digunakan dalam aplikasi.
// Ganti nilai API_BASE_URL dengan URL backend Anda yang sesungguhnya.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const API_ENDPOINTS = {
  // Endpoint untuk otentikasi
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  GET_PROFILE: `${API_BASE_URL}/auth/profile`,

  // Endpoint untuk Jemaat (Members)
  GET_MEMBERS: `${API_BASE_URL}/members`,
  GET_MEMBER_BY_ID: (id: string) => `${API_BASE_URL}/members/${id}`,
  GET_MEMBER_BY_PHONE: (phone: string) => `${API_BASE_URL}/members/phone/${phone}`,
  UPDATE_MEMBER: (id: string) => `${API_BASE_URL}/members/${id}`,
  DELETE_MEMBER: (id: string) => `${API_BASE_URL}/members/${id}`,

  // Endpoint untuk Acara Check-in
  GET_CHECK_IN_EVENTS: `${API_BASE_URL}/check-in/events`,
  GET_CHECK_IN_EVENT_BY_ID: (id: string) => `${API_BASE_URL}/check-in/events/${id}`,
  ADD_CHECK_IN_EVENT: `${API_BASE_URL}/check-in/events`,
  UPDATE_CHECK_IN_EVENT: (id: string) => `${API_BASE_URL}/check-in/events/${id}`,
  DELETE_CHECK_IN_EVENT: (id: string) => `${API_BASE_URL}/check-in/events/${id}`,
  UPDATE_CHECK_IN_EVENT_STATUS: (id: string) => `${API_BASE_URL}/check-in/events/${id}/status`,
  SET_CHECK_IN_EVENT_TIMER: (id: string) => `${API_BASE_URL}/check-in/events/${id}/timer`,
  ADD_ATTENDEE_TO_EVENT: (eventId: string) => `${API_BASE_URL}/check-in/events/${eventId}/attendees`,
  
  // Endpoint untuk Riwayat Check-in Pribadi
  GET_PERSONAL_CHECK_IN_HISTORY: (userId: string) => `${API_BASE_URL}/members/${userId}/check-in-history`,

  // Endpoint untuk Pokok Doa (Prayer Requests)
  GET_PRAYER_REQUESTS: `${API_BASE_URL}/prayers`,
  ADD_PRAYER_REQUEST: `${API_BASE_URL}/prayers`,
  GET_PRAYER_REQUEST_BY_ID: (id: string) => `${API_BASE_URL}/prayers/${id}`,
  RESPOND_TO_PRAYER_REQUEST: (id: string) => `${API_BASE_URL}/prayers/${id}/respond`,
  ARCHIVE_PRAYER: (id: string) => `${API_BASE_URL}/prayers/${id}/archive`,
  DELETE_PRAYERS: `${API_BASE_URL}/prayers`,

  // Endpoint untuk Pertanyaan (Questions)
  GET_QUESTIONS: `${API_BASE_URL}/questions`,
  ADD_QUESTION: `${API_BASE_URL}/questions`,
  GET_QUESTION_BY_ID: (id: string) => `${API_BASE_URL}/questions/${id}`,
  RESPOND_TO_QUESTION: (id: string) => `${API_BASE_URL}/questions/${id}/respond`,
  ARCHIVE_QUESTION: (id: string) => `${API_BASE_URL}/questions/${id}/archive`,
  DELETE_QUESTIONS: `${API_BASE_URL}/questions`,

  // Endpoint untuk Tiket Dukungan (Support Tickets)
  CREATE_SUPPORT_TICKET: `${API_BASE_URL}/tickets`,
  GET_ALL_SUPPORT_TICKETS: `${API_BASE_URL}/tickets`,
  GET_SUPPORT_TICKET_BY_ID: (id: string) => `${API_BASE_URL}/tickets/${id}`,
  UPDATE_SUPPORT_TICKET: (id: string) => `${API_BASE_URL}/tickets/${id}`,
};
