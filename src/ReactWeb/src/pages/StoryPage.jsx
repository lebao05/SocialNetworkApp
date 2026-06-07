import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import UserStoryViewer from "../components/Story/UserStoryViewer";
import { useProfileStories } from "../hooks/useProfileStories";

export default function StoryPage() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { group, isLoading, error } = useProfileStories(userId);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        </div>
      );
    }

    if (error || !group || group.stories.length === 0) {
      return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center text-white">
          <h1 className="text-2xl font-bold">Story not available</h1>
          <p className="max-w-md text-sm text-white/70">{error || "This user does not have an active story right now."}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#111827] transition hover:bg-white/90"
          >
            Go back
          </button>
        </div>
      );
    }

    return <UserStoryViewer group={group} onClose={() => navigate(-1)} />;
  }, [error, group, isLoading, navigate]);

  if (!group && !error && isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1115]">
        <Navbar />
        <div className="pt-14">{content}</div>
      </div>
    );
  }

  if (group && !isLoading) {
    return <UserStoryViewer group={group} onClose={() => navigate(-1)} />;
  }

  return (
    <div className="min-h-screen bg-[#0f1115]">
      <Navbar />
      <div className="pt-14">{content}</div>
    </div>
  );
}
