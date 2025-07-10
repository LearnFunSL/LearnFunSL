import { Resource } from "@/types/resources";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
      <div className="flex flex-col">
        <h3 className="font-semibold text-md">{resource.title}</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>{resource.medium} Medium</span>
          <span className="flex items-center">
            <Download className="w-4 h-4 mr-1" />
            {resource.download_count || 0}
          </span>
        </div>
      </div>
      <Button asChild variant="outline" size="sm">
        <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
          Download
        </a>
      </Button>
    </div>
  );
}
