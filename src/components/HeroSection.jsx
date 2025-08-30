import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { UploadCloud, File, X } from "lucide-react";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const HeroSection = ({
  theme,
  input,
  setInput,
  handleAnalyze, // now expects (file, input)
  loading,
  error,
  setError, // optional: pass from parent to show file-size errors etc.
}) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // create object URL for preview when file changes
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
        setPreviewUrl(null);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const validateAndSetFile = (f) => {
    if (!f) return;
    if (f.size > MAX_FILE_SIZE_BYTES) {
      const msg = `File too large. Max ${
        MAX_FILE_SIZE_BYTES / (1024 * 1024)
      } MB.`;
      if (setError) setError(msg); // propagate to parent if possible
      else console.warn(msg);
      return;
    }
    setFile(f);
    if (setError) setError(null);
    setInput(""); // clear text when file chosen (optional UX)
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
      // clear the file input value so same file can be selected again if needed
      e.target.value = "";
    }
  };

  const removeFile = () => {
    setFile(null);
    if (setError) setError(null);
  };

  const onAnalyzeClick = () => {
    // call parent's handler with both file and input
    handleAnalyze(file, input);
  };

  const handleKeyDown = (e) => {
    // trigger on Enter if we have either input or file and not loading
    if (e.key === "Enter" && !loading && (input.trim() || file)) {
      onAnalyzeClick();
    }
  };

  const humanSize = (bytes) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <iframe
          src="https://my.spline.design/cybernetwork-2vreeLlp7aehGATtB7A6cw8U/"
          frameBorder="0"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="Spline Scene"
        />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="w-full">
          <div className="max-w-4xl mx-auto px-4">
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="rounded-3xl shadow-2xl border p-4 md:p-6 backdrop-blur-md"
              style={{
                // background: "var(--card)",
                borderColor: "var(--border)",
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Main input / drop zone */}
              <div
                className={`transition-colors duration-300 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center
                  ${isDragging ? "border-blue-500 bg-blue-500/10" : ""}
                `}
                style={{ borderColor: "var(--border)" }}
              >
                {!file ? (
                  <>
                    <UploadCloud
                      className="w-8 h-8 mb-2"
                      style={{ color: "var(--subtext)" }}
                    />
                    <p className="mb-2" style={{ color: "var(--text)" }}>
                      Drag & drop a file (image, audio) or paste text/URL below
                    </p>

                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Paste text or a URL to analyze…"
                      className="w-full text-center px-4 py-3 rounded-2xl border outline-none focus:ring-2 mt-2"
                      style={{
                        background:
                          theme === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(255,255,255,0.9)",
                        color: "var(--text)",
                        borderColor: "var(--border)",
                      }}
                    />

                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="text-sm mt-2 text-blue-500 cursor-pointer"
                    >
                      Or browse for a file
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,audio/*"
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <File
                      className="w-8 h-8 mb-2"
                      style={{ color: "var(--text)" }}
                    />
                    <p
                      className="font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {file.name}
                    </p>
                    <p className="text-sm" style={{ color: "var(--subtext)" }}>
                      ({humanSize(file.size)}) • {file.type || "file"}
                    </p>

                    {/* Preview */}
                    {previewUrl && file.type.startsWith("image") && (
                      <img
                        src={previewUrl}
                        alt="preview"
                        className="mt-3 max-w-[240px] rounded-lg shadow"
                      />
                    )}
                    {previewUrl && file.type.startsWith("audio") && (
                      <audio className="mt-3" controls src={previewUrl} />
                    )}

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={removeFile}
                        className="p-2 rounded-full hover:bg-red-500/10"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                      <button
                        onClick={() => fileInputRef.current.click()}
                        className="text-sm px-3 py-1 rounded-md border"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--text)",
                        }}
                      >
                        Replace
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={onAnalyzeClick}
                  disabled={loading || (!input.trim() && !file)}
                  className="w-full md:w-auto shrink-0 px-8 py-3 rounded-2xl font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                  style={{ background: "var(--accent)", color: "white" }}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="animate-spin inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent" />
                      Analyzing…
                    </span>
                  ) : (
                    "Analyze"
                  )}
                </button>
              </div>

              {error && (
                <div
                  className="mt-3 text-sm text-center"
                  style={{ color: "var(--subtext)" }}
                >
                  {error}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
