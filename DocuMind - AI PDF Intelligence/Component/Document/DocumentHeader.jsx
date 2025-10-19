import React from "react";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function DocumentHeader({ document }) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{document.title}</h1>
          <p className="text-sm text-slate-500">
            Uploaded {format(new Date(document.created_date), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        {document.file_size && (
          <Badge variant="outline" className="border-slate-200">
            {document.file_size}
          </Badge>
        )}
        <a href={document.file_url} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="border-slate-200 hover:border-indigo-500 hover:text-indigo-600">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </a>
      </div>
    </div>
  );
}