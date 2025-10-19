import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

export default function UploadPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState("");
  const [error, setError] = useState(null);

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      setError(null);
      setUploadProgress(10);
      setProcessingStep("Uploading PDF...");

      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      setUploadProgress(30);
      setProcessingStep("Extracting text from PDF...");

      const extractionResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            text: { type: "string" }
          }
        }
      });

      if (extractionResult.status === "error") {
        throw new Error("Failed to extract text from PDF");
      }

      const extractedText = extractionResult.output.text;
      
      setUploadProgress(50);
      setProcessingStep("Generating brief summary...");

      const briefSummary = await base44.integrations.Core.InvokeLLM({
        prompt: `Provide a brief summary (2-3 sentences) of the following document:\n\n${extractedText.substring(0, 15000)}`,
      });

      setUploadProgress(65);
      setProcessingStep("Generating detailed summary...");

      const detailedSummary = await base44.integrations.Core.InvokeLLM({
        prompt: `Provide a comprehensive, detailed summary of the following document. Include all key points, main arguments, and important details:\n\n${extractedText.substring(0, 15000)}`,
      });

      setUploadProgress(80);
      setProcessingStep("Generating bullet points...");

      const bulletSummary = await base44.integrations.Core.InvokeLLM({
        prompt: `Provide a bullet-point summary of the following document. Use clear, concise bullet points to highlight the main ideas:\n\n${extractedText.substring(0, 15000)}`,
      });

      setUploadProgress(95);
      setProcessingStep("Saving document...");

      const document = await base44.entities.Document.create({
        title: file.name.replace('.pdf', ''),
        file_url,
        extracted_text: extractedText,
        brief_summary: briefSummary,
        detailed_summary: detailedSummary,
        bullet_summary: bulletSummary,
        file_size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        status: "ready"
      });

      setUploadProgress(100);
      return document;
    },
    onSuccess: (document) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setTimeout(() => {
        navigate(createPageUrl(`DocumentView?id=${document.id}`));
      }, 500);
    },
    onError: (error) => {
      setError(error.message || "Failed to process document. Please try again.");
      setUploadProgress(0);
      setProcessingStep("");
    },
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else {
      setError("Please upload a PDF file");
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setError(null);
    } else {
      setError("Please upload a PDF file");
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="rounded-xl border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Upload Document</h1>
            <p className="text-slate-600 mt-1 text-lg">Upload a PDF to summarize and chat with</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`p-12 transition-all duration-300 ${
              dragActive 
                ? "bg-gradient-to-br from-indigo-50 to-cyan-50 border-2 border-indigo-400 border-dashed" 
                : "bg-white"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
            />

            {!selectedFile && !uploadMutation.isPending && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Upload Your PDF</h3>
                <p className="text-slate-600 mb-6 text-lg">Drag and drop or click to browse</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-lg shadow-indigo-500/30 px-8 py-6 text-lg"
                >
                  Select PDF File
                </Button>
                <p className="text-sm text-slate-400 mt-6">Supported format: PDF (up to 50MB)</p>
              </motion.div>
            )}

            {selectedFile && !uploadMutation.isPending && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <FileText className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedFile.name}</h3>
                <p className="text-slate-600 mb-6">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFile(null)}
                    className="border-slate-200 hover:border-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-lg shadow-indigo-500/30"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Process Document
                  </Button>
                </div>
              </motion.div>
            )}

            {uploadMutation.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center animate-pulse shadow-lg shadow-indigo-500/30">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Processing Your Document</h3>
                <p className="text-slate-600 mb-6">{processingStep}</p>
                <div className="max-w-md mx-auto">
                  <Progress value={uploadProgress} className="h-2 mb-2" />
                  <p className="text-sm text-slate-500">{uploadProgress}% complete</p>
                </div>
              </motion.div>
            )}
          </div>
        </Card>

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <h3 className="text-lg font-bold text-slate-900 mb-4">What happens next?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-indigo-600">1</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">Text Extraction</p>
                <p className="text-sm text-slate-600">We extract all text content from your PDF</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-indigo-600">2</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">AI Summarization</p>
                <p className="text-sm text-slate-600">Generate brief, detailed, and bullet-point summaries</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-indigo-600">3</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">Chat Ready</p>
                <p className="text-sm text-slate-600">Ask questions and get instant answers from your document</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}