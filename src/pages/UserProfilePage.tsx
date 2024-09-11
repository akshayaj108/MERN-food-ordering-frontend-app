import {
  useGetMyUserProfileData,
  useUpdateMyUser,
} from "@/apiRequest/MyUserApi";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";

const UserProfilePage = () => {
  const { currentUser, isLoading: isGetLoading } = useGetMyUserProfileData();
  const { updateUser, isLoading: isUpdateLoading } = useUpdateMyUser();
  if (isGetLoading) {
    return <span>Loading...</span>;
  }
  if (!currentUser) {
    return <span>Unable to load user profile data</span>;
  }
  return (
    <UserProfileForm
      currentUser={currentUser}
      onSave={updateUser}
      isLoading={isUpdateLoading}
    />
  );
};

export default UserProfilePage;
