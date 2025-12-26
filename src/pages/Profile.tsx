import ProfileForm from "../components/ProfileForm";
import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
            <Link to="/" className="text-blue-600 hover:underline">
              ← Back to Chat
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-4">Complete Your Profile</h1>
            <p className="text-gray-600 mt-2">
              Tell us about yourself so we can give you the perfect advice.
            </p>
        </div>
        
        <ProfileForm />
      </div>
    </main>
  );
}
