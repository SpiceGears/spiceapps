"use client";

import { useState } from "react";
import {
  api,
  RegistrationRequest,
  RegistrationRequestStatus,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check, X, Clock, RefreshCw, AlertCircle } from "lucide-react";

interface RegistrationRequestsTabProps {
  requests: RegistrationRequest[];
  onRefresh: () => void;
}

export default function RegistrationRequestsTab({
  requests,
  onRefresh,
}: RegistrationRequestsTabProps) {
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const handleApprove = async (id: string) => {
    try {
      setLoading(true);
      await api.approveRegistrationRequest(id);
      toast.success("Zgłoszenie rejestracyjne zostało zatwierdzone");
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Nie udało się zatwierdzić zgłoszenia");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequestId) return;

    try {
      setLoading(true);
      await api.rejectRegistrationRequest(selectedRequestId, rejectionReason);
      toast.success("Zgłoszenie rejestracyjne zostało odrzucone");
      setRejectionReason("");
      setSelectedRequestId(null);
      setIsRejectDialogOpen(false);
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || "Nie udało się odrzucić zgłoszenia");
    } finally {
      setLoading(false);
    }
  };

  const openRejectDialog = (id: string) => {
    setSelectedRequestId(id);
    setIsRejectDialogOpen(true);
  };

  const getStatusBadge = (status: RegistrationRequestStatus) => {
    switch (status) {
      case RegistrationRequestStatus.Pending:
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
          >
            <Clock className="w-3 h-3 mr-1" />
            Oczekujące
          </Badge>
        );
      case RegistrationRequestStatus.Approved:
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-600 border-green-500/20"
          >
            <Check className="w-3 h-3 mr-1" />
            Zatwierdzone
          </Badge>
        );
      case RegistrationRequestStatus.Rejected:
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-600 border-red-500/20"
          >
            <X className="w-3 h-3 mr-1" />
            Odrzucone
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pl-PL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingRequests = requests.filter(
    (r) => r.status === RegistrationRequestStatus.Pending
  );
  const processedRequests = requests.filter(
    (r) => r.status !== RegistrationRequestStatus.Pending
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Zgłoszenia rejestracyjne</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Przeglądanie i zatwierdzanie zgłoszeń rejestracji użytkowników z
            aplikacji zewnętrznych
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Odśwież
        </Button>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold">
              Oczekujące zgłoszenia ({pendingRequests.length})
            </h3>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Użytkownik</TableHead>
                  <TableHead>Aplikacja źródłowa</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Data zgłoszenia</TableHead>
                  <TableHead className="text-right">Akcje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.username}</div>
                        {(request.firstName || request.lastName) && (
                          <div className="text-sm text-muted-foreground">
                            {request.firstName} {request.lastName}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {request.sourceApp}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{request.email}</TableCell>
                    <TableCell className="text-sm">
                      {formatDate(request.requestedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(request.id)}
                          disabled={loading}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Zatwierdź
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openRejectDialog(request.id)}
                          disabled={loading}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Odrzuć
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            Przetworzone zgłoszenia ({processedRequests.length})
          </h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Użytkownik</TableHead>
                  <TableHead>Aplikacja źródłowa</TableHead>
                  <TableHead>Data zgłoszenia</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data rozpatrzenia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.username}</div>
                        {(request.firstName || request.lastName) && (
                          <div className="text-sm text-muted-foreground">
                            {request.firstName} {request.lastName}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {request.sourceApp}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(request.requestedAt)}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-sm">
                      {request.reviewedAt
                        ? formatDate(request.reviewedAt)
                        : "-"}
                      {request.rejectionReason && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Powód: {request.rejectionReason}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {requests.length === 0 && (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">
            Nie znaleziono zgłoszeń rejestracyjnych
          </p>
        </div>
      )}

      {/* Reject Dialog */}
      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Odrzuć zgłoszenie rejestracyjne</AlertDialogTitle>
            <AlertDialogDescription>
              Czy na pewno chcesz odrzucić to zgłoszenie rejestracyjne? Możesz
              opcjonalnie podać powód.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Powód odrzucenia (opcjonalnie)"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="mt-2"
            rows={3}
          />
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setRejectionReason("");
                setSelectedRequestId(null);
              }}
            >
              Anuluj
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700"
            >
              Odrzuć zgłoszenie
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
