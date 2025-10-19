import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Upload, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function EmptyState({ hasDocuments, searchQuery }) {
  if (hasDocuments && searchQuery) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">No documents found</h3>
        <p className="text-slate-600 mb-6">Try adjusting your search query</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Upload className="w-12 h-12 text-indigo-600" />
      </div>
      <h3 className="text-3xl font-bold text-slate-900 mb-2">No documents yet</h3>
      <p className="text-slate-600 mb-8 text-lg">Upload your first PDF to get started</p>
      <Link to={createPageUrl("Upload")}>
        <Button className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-lg shadow-indigo-500/30 px-8 py-6 text-lg">
          <Upload className="w-5 h-5 mr-2" />
          Upload Your First Document
        </Button>
      </Link>
    </motion.div>
  );
}