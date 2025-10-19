import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, List, AlignLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function SummaryPanel({ document }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-none shadow-lg rounded-2xl overflow-hidden bg-white">
        <Tabs defaultValue="brief" className="w-full">
          <div className="border-b border-slate-200/60 bg-slate-50/50 px-6 py-4">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-white shadow-sm border border-slate-200/60 p-1 rounded-xl">
              <TabsTrigger 
                value="brief"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Brief
              </TabsTrigger>
              <TabsTrigger 
                value="detailed"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-sm"
              >
                <AlignLeft className="w-4 h-4 mr-2" />
                Detailed
              </TabsTrigger>
              <TabsTrigger 
                value="bullets"
                className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-sm"
              >
                <List className="w-4 h-4 mr-2" />
                Bullets
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="brief" className="mt-0">
              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Brief Summary</h3>
                <p className="text-slate-700 leading-relaxed text-lg">
                  {document.brief_summary || "No brief summary available."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="mt-0">
              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Detailed Summary</h3>
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {document.detailed_summary || "No detailed summary available."}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bullets" className="mt-0">
              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Key Points</h3>
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {document.bullet_summary || "No bullet points available."}
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </motion.div>
  );
}