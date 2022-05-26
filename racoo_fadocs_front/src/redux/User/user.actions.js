import { UPDATE_PROFILE_IMAGE } from './user.types';

export function updateProfileImage(profileImage) {
  return { type: UPDATE_PROFILE_IMAGE, payload: profileImage };
}
