import { useNavigate } from "react-router";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ErrorPageProps {
  error?: {
    status?: number;
    message?: string;
    data?: any;
  };
}

const ErrorPage = ({ error }: ErrorPageProps) => {
  const navigate = useNavigate();

  const status = error?.status || 500;
  const message = error?.message || "An unexpected error occurred";
  const errorData = error?.data;

  const getErrorTitle = (statusCode: number) => {
    switch (statusCode) {
      case 400:
        return "Bad Request";
      case 401:
        return "Unauthorized";
      case 403:
        return "Forbidden";
      case 404:
        return "Not Found";
      case 500:
        return "Server Error";
      case 502:
        return "Bad Gateway";
      case 503:
        return "Service Unavailable";
      default:
        return "Error";
    }
  };

  const getErrorDescription = (statusCode: number) => {
    switch (statusCode) {
      case 400:
        return "The request was invalid or cannot be served.";
      case 401:
        return "You need to log in to access this resource.";
      case 403:
        return "You don't have permission to access this resource.";
      case 404:
        return "The requested resource could not be found.";
      case 500:
        return "Something went wrong on our end. Please try again later.";
      case 502:
        return "The server received an invalid response from an upstream server.";
      case 503:
        return "The service is temporarily unavailable. Please try again later.";
      default:
        return "An unexpected error occurred.";
    }
  };

  const getErrorColor = (statusCode: number) => {
    switch (statusCode) {
      case 400:
        return "text-orange-600";
      case 401:
        return "text-yellow-600";
      case 403:
        return "text-red-600";
      case 404:
        return "text-gray-600";
      case 500:
      case 502:
      case 503:
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRetry = () => {
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-muted ${getErrorColor(status)}`}>
              <AlertCircle className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl">{getErrorTitle(status)}</CardTitle>
              <Badge variant="outline" className="mt-2">
                Status Code: {status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground">{getErrorDescription(status)}</p>
            {message && (
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-medium text-foreground">{message}</p>
              </div>
            )}
          </div>

          {errorData && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">Error Details:</p>
              <div className="rounded-md bg-muted p-4">
                <pre className="text-xs text-muted-foreground overflow-x-auto">
                  {typeof errorData === "string"
                    ? errorData
                    : JSON.stringify(errorData, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={handleGoHome}>
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;
