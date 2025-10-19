import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const statusConfig = {
  ready: {
    icon: CheckCircle2,
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    label: "Ready"
  },
  processing: {
    icon: Clock,
    color: "bg-amber-100 text-amber-700 border-amber-200",
    label: "Processing"
  },
  error: {
    icon: AlertCircle,
    color: "bg-red-100 text-red-700 border-red-200",
    label: "Error"
  }
};

export default function DocumentCard({ document, index }) {
  const status = statusConfig[document.status] || statusConfig.ready;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={createPageUrl(`DocumentView?id=${document.id}`)}>
        <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200/60 rounded-2xl overflow-hidden bg-white hover:border-indigo-300 cursor-pointer">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:from-indigo-200 group-hover:to-cyan-200 transition-colors">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {document.title}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {format(new Date(document.created_date), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Badge className={`${status.color} border font-medium`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
              {document.file_size && (
                <Badge variant="outline" className="border-slate-200 text-slate-600">
                  {document.file_size}
                </Badge>
              )}
            </div>

            {document.brief_summary && (
              <p className="text-sm text-slate-600 line-clamp-2">
                {document.brief_summary}
              </p>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}