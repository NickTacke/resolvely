"use client";

import React from "react";
import { Send } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  createdAt: Date;
}

interface TicketCommentsProps {
  comments: Comment[];
  newComment: string;
  setNewComment: (value: string) => void;
  onSubmitComment: () => void;
  isSubmitting: boolean;
}

export function TicketComments({
  comments,
  newComment,
  setNewComment,
  onSubmitComment,
  isSubmitting,
}: TicketCommentsProps) {
  // Helper to format date to "x time ago" format
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmitComment();
    }
  };

  return (
    <div className="space-y-4">
      {/* Comment input */}
      <Card>
        <div className="p-4">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] mb-2"
            onKeyDown={handleKeyDown}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Press <kbd className="px-1 py-0.5 text-xs border rounded-md">Ctrl</kbd>+<kbd className="px-1 py-0.5 text-xs border rounded-md">Enter</kbd> to submit
            </span>
            <Button 
              size="sm" 
              onClick={onSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
            >
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Sending..." : "Add Comment"}
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Comments list */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <Card key={comment.id} className="overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.image || ""} />
                      <AvatarFallback>
                        {comment.author.name
                          ? comment.author.name.charAt(0).toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">
                        {comment.author.name || comment.author.email}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimeAgo(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm whitespace-pre-wrap pl-10">
                  {comment.content}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="p-8 text-center text-muted-foreground">
            <p>No comments yet. Be the first to leave a comment!</p>
          </div>
        </Card>
      )}
    </div>
  );
}