import { AnnouncementsState } from "./announcements/announcements.reducer";
import { UsersState } from "./users/users.reducer"

export interface AppState {
    users: UsersState,
    announcements: AnnouncementsState;
}