"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, Copy, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { PersonalizedMessageInput } from "@/ai/flows/generate-personalized-message";
import { generatePersonalizedMessageAction } from "@/app/actions";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type Member = {
  id: string;
  name: string;
  lastAttended: string;
  attendanceRate: number;
  attendanceHistory: string;
  recentActivities: string;
};

const mockData: Member[] = [
  { id: "1", name: "Alice Johnson", lastAttended: "2024-07-21", attendanceRate: 95, attendanceHistory: "Regular attendee, missed 1 of the last 20 services.", recentActivities: "Volunteered at the recent food drive." },
  { id: "2", name: "Bob Williams", lastAttended: "2024-07-14", attendanceRate: 80, attendanceHistory: "Attends most services.", recentActivities: "Joined the new bible study group." },
  { id: "3", name: "Charlie Brown", lastAttended: "2024-05-12", attendanceRate: 25, attendanceHistory: "Has not attended in the last 2 months. Previously attended sporadically.", recentActivities: "None." },
  { id: "4", name: "Diana Miller", lastAttended: "2024-07-28", attendanceRate: 100, attendanceHistory: "Perfect attendance for the last 6 months.", recentActivities: "Leads the youth choir." },
  { id: "5", name: "Ethan Garcia", lastAttended: "2024-06-02", attendanceRate: 40, attendanceHistory: "Attendance has been dropping over the last 3 months.", recentActivities: "Previously active in the men's group." },
];

export function AttendanceReport() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateMessage = async () => {
    if (!selectedMember) return;
    setIsLoading(true);
    setGeneratedMessage("");

    const input: PersonalizedMessageInput = {
      memberName: selectedMember.name,
      attendanceHistory: selectedMember.attendanceHistory,
      recentActivities: selectedMember.recentActivities,
    };

    const result = await generatePersonalizedMessageAction(input);
    setIsLoading(false);

    if (result.success) {
      setGeneratedMessage(result.message);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
      setSelectedMember(null);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    toast({
        title: "Copied!",
        description: "Message copied to clipboard.",
    });
  }

  const handleOpenDialog = (member: Member) => {
    if(member.attendanceRate < 50) {
      setSelectedMember(member);
      setGeneratedMessage("");
    } else {
       toast({
        title: "High Attendance",
        description: `${member.name} has a high attendance rate. No message needed.`,
      });
    }
  }
  
  const handleCloseDialog = () => {
    setSelectedMember(null);
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member Name</TableHead>
              <TableHead className="hidden sm:table-cell">Last Attended</TableHead>
              <TableHead>Attendance Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell className="hidden sm:table-cell">{member.lastAttended}</TableCell>
                <TableCell>
                  <Badge variant={member.attendanceRate < 50 ? "destructive" : "default"} className={member.attendanceRate < 50 ? "bg-destructive/80 text-destructive-foreground" : "bg-green-600/80 text-white"}>
                    {member.attendanceRate}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(member)}>
                    <MessageSquarePlus className="h-4 w-4 mr-2" />
                    Generate Message
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-accent">Generate Message</DialogTitle>
            <DialogDescription>
              AI-powered personalized message for {selectedMember?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : generatedMessage ? (
              <div className="space-y-2">
                <Textarea readOnly value={generatedMessage} rows={8} className="bg-background/50" />
                <Button onClick={handleCopy} className="w-full"><Copy className="mr-2 h-4 w-4" /> Copy Message</Button>
              </div>
            ) : (
                <div className="text-sm text-muted-foreground">
                    <p><strong>Member:</strong> {selectedMember?.name}</p>
                    <p><strong>Attendance History:</strong> {selectedMember?.attendanceHistory}</p>
                    <p><strong>Recent Activities:</strong> {selectedMember?.recentActivities}</p>
                </div>
            )}
          </div>
          {!isLoading && !generatedMessage && (
            <DialogFooter>
              <Button onClick={handleGenerateMessage} className="w-full">
                <MessageSquarePlus className="mr-2 h-4 w-4" /> Generate
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
