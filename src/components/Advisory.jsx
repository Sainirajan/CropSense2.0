import React, { useState, useRef } from 'react';
import { Upload, MessageCircle, Mic, Volume2, FileText, Send, Loader2, X, Paperclip, Play, Pause } from 'lucide-react';
import PestAdvisory from './PestAdvisory';

const Advisory = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedAudioFile, setSelectedAudioFile] = useState(null);
    const [question, setQuestion] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isAsking, setIsAsking] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessingAudio, setIsProcessingAudio] = useState(false);
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);
    const [messages, setMessages] = useState([]);
    const fileInputRef = useRef(null);
    const audioFileInputRef = useRef(null);
    const audioPreviewRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Select PDFs
    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        const pdfFiles = files.filter(file => file.type === 'application/pdf');
        if (pdfFiles.length !== files.length) {
            alert('Only PDF files are allowed. Non-PDF files have been filtered out.');
        }
        setSelectedFiles(pdfFiles);
    };

    // Select Audio File
    const handleAudioFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const audioTypes = [
                'audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/m4a',
                'audio/ogg', 'audio/webm', 'audio/aac', 'audio/flac'
            ];
            const isValidAudio = audioTypes.some(type =>
                file.type.includes(type.split('/')[1]) || file.name.toLowerCase().endsWith(`.${type.split('/')[1]}`)
            );

            if (isValidAudio || file.type.startsWith('audio/')) {
                setSelectedAudioFile(file);
                setQuestion(''); // Clear text input when audio file is selected
            } else {
                alert('Please select a valid audio file (WAV, MP3, M4A, AAC, OGG, WebM, or FLAC)');
            }
        }
    };

    // Play/Pause Audio Preview
    const toggleAudioPreview = () => {
        if (audioPreviewRef.current && selectedAudioFile) {
            if (isPlayingPreview) {
                audioPreviewRef.current.pause();
                setIsPlayingPreview(false);
            } else {
                const url = URL.createObjectURL(selectedAudioFile);
                audioPreviewRef.current.src = url;
                audioPreviewRef.current.play();
                setIsPlayingPreview(true);
                audioPreviewRef.current.onended = () => setIsPlayingPreview(false);
            }
        }
    };

    // Remove Audio File
    const removeAudioFile = () => {
        setSelectedAudioFile(null);
        setIsPlayingPreview(false);
        if (audioPreviewRef.current) {
            audioPreviewRef.current.src = '';
            audioPreviewRef.current.pause();
        }
    };

    // Upload PDFs
    const handleUploadPDFs = async () => {
        if (selectedFiles.length === 0) {
            alert('Please select PDF files first');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await fetch('http://localhost:8000/upload_pdfs/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setMessages(prev => [...prev, {
                    type: 'system',
                    content: 'PDFs uploaded and processed successfully! You can now ask questions about the documents.',
                    timestamp: new Date().toLocaleTimeString()
                }]);
            } else {
                const errorResult = await response.json();
                throw new Error(errorResult.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading PDFs:', error);
            setMessages(prev => [...prev, {
                type: 'error',
                content: `Failed to upload PDFs: ${error.message}`,
                timestamp: new Date().toLocaleTimeString()
            }]);
        } finally {
            setIsUploading(false);
        }
    };

    // Process Audio File
    const handleProcessAudioFile = async () => {
        if (!selectedAudioFile) {
            alert('Please select an audio file first');
            return;
        }

        setIsProcessingAudio(true);
        const formData = new FormData();
        formData.append('file', selectedAudioFile);

        try {
            // Add user message showing audio file
            const userMessage = {
                type: 'user',
                content: `🎵 Audio file: ${selectedAudioFile.name}`,
                isAudio: true,
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, userMessage]);

            const response = await fetch('http://localhost:8000/process_audio_file/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();

                // Add transcribed text message
                const transcriptionMessage = {
                    type: 'system',
                    content: `Transcribed: "${result.text}"`,
                    timestamp: new Date().toLocaleTimeString()
                };
                setMessages(prev => [...prev, transcriptionMessage]);

                // Add bot answer
                const botMessage = {
                    type: 'bot',
                    content: result.answer,
                    malayalam: null,
                    timestamp: new Date().toLocaleTimeString()
                };
                setMessages(prev => [...prev, botMessage]);

                // Auto-translate + Speak Malayalam
                await handleTranslateAndSpeak(result.answer);

                // Clear audio file after processing
                removeAudioFile();
            } else {
                const errorResult = await response.json();
                throw new Error(errorResult.error || 'Audio processing failed');
            }
        } catch (error) {
            console.error('Error processing audio file:', error);
            setMessages(prev => [...prev, {
                type: 'error',
                content: `Failed to process audio file: ${error.message}`,
                timestamp: new Date().toLocaleTimeString()
            }]);
        } finally {
            setIsProcessingAudio(false);
        }
    };

    // Ask a question
    const handleAskQuestion = async () => {
        if (!question.trim() && !selectedAudioFile) {
            alert('Please enter a question or select an audio file');
            return;
        }

        // If audio file is selected, process it instead
        if (selectedAudioFile) {
            return handleProcessAudioFile();
        }

        setIsAsking(true);
        const userMessage = {
            type: 'user',
            content: question,
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, userMessage]);

        const formData = new FormData();
        formData.append('question', question);

        try {
            const response = await fetch('http://localhost:8000/ask/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                const botMessage = {
                    type: 'bot',
                    content: result.answer,
                    malayalam: null,
                    timestamp: new Date().toLocaleTimeString()
                };

                // Add English answer first
                setMessages(prev => [...prev, botMessage]);

                // Auto-translate + Speak Malayalam
                await handleTranslateAndSpeak(result.answer);
            } else {
                const errorResult = await response.json();
                throw new Error(errorResult.error || 'Question processing failed');
            }
        } catch (error) {
            console.error('Error asking question:', error);
            setMessages(prev => [...prev, {
                type: 'error',
                content: `Failed to process question: ${error.message}`,
                timestamp: new Date().toLocaleTimeString()
            }]);
        } finally {
            setIsAsking(false);
            setQuestion('');
        }
    };

    // Translate to Malayalam & auto-speak
    const handleTranslateAndSpeak = async (text) => {
        try {
            const formData = new FormData();
            formData.append('text', text);

            const response = await fetch('http://localhost:8000/malayalam_tts/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();

                setMessages(prev => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    if (updated[lastIndex].type === 'bot') {
                        updated[lastIndex].malayalam = result.mal_text;
                        updated[lastIndex].audioUrl = `http://localhost:8000${result.audio_url}`;
                    }
                    return updated;
                });

                // Auto play Malayalam speech
                try {
                    const audio = new Audio(`http://localhost:8000${result.audio_url}`);
                    audio.play().catch(err => {
                        console.log('Audio autoplay blocked by browser:', err);
                    });
                } catch (audioErr) {
                    console.log('Audio playback error:', audioErr);
                }
            } else {
                const errorResult = await response.json();
                console.error('Translation error:', errorResult.error);
            }
        } catch (error) {
            console.error('Error translating/speaking:', error);
        }
    };

    // 🎤 Malayalam voice input (direct recording)
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm' // Use WebM for better browser support
            });
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await handleDirectAudioToText(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start(1000); // Collect data every second
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Failed to start recording. Please check microphone permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Handle direct audio recording (existing functionality)
    const handleDirectAudioToText = async (audioBlob) => {
        const formData = new FormData();
        formData.append('file', audioBlob, 'recording.webm');

        try {
            const response = await fetch('http://localhost:8000/malayalam_audio_to_text/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setQuestion(result.text); // Set transcribed text in input field
                // Don't auto-ask, let user review the transcription
            } else {
                const errorResult = await response.json();
                alert(`Failed to convert audio: ${errorResult.error}`);
            }
        } catch (error) {
            console.error('Error converting audio to text:', error);
            alert('Failed to convert audio. Please try again.');
        }
    };

    // Clear chat
    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
            <audio ref={audioPreviewRef} style={{ display: 'none' }} />
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <MessageCircle className="mr-2 text-green-600" />
                            Agricultural Assistant
                        </h2>
                        <button
                            onClick={clearMessages}
                            className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 rounded hover:bg-gray-100 transition-colors"
                        >
                            Clear Chat
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center text-gray-500 mt-20">
                                <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="text-lg">Start by uploading PDFs, asking a question, or uploading an audio file!</p>
                                <p className="text-sm mt-2 text-gray-400">You can use voice recording for Malayalam input</p>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${message.type === 'user'
                                                ? 'bg-green-600 text-white'
                                                : message.type === 'system'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : message.type === 'error'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">
                                            {message.type === 'bot' && message.malayalam
                                                ? message.malayalam
                                                : message.content}
                                        </p>
                                        {message.type === 'bot' && message.malayalam && (
                                            <div className="mt-2 pt-2 border-t border-gray-300">
                                                <p className="text-xs text-gray-600 mb-1">English:</p>
                                                <p className="text-xs text-gray-600">{message.content}</p>
                                                {message.audioUrl && (
                                                    <button
                                                        onClick={() => {
                                                            const audio = new Audio(message.audioUrl);
                                                            audio.play();
                                                        }}
                                                        className="mt-1 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                                    >
                                                        🔊 Play Malayalam
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <p className="text-xs mt-1 opacity-75">{message.timestamp}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Audio File Preview */}
                    {selectedAudioFile && (
                        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={toggleAudioPreview}
                                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                    >
                                        {isPlayingPreview ? <Pause size={16} /> : <Play size={16} />}
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        {selectedAudioFile.name} ({(selectedAudioFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                </div>
                                <button
                                    onClick={removeAudioFile}
                                    className="p-1 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-6 border-t border-gray-200">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAskQuestion();
                                    }
                                }}
                                placeholder={selectedAudioFile ? "Audio file selected - click Send to process" : "Ask in English or Malayalam..."}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                disabled={!!selectedAudioFile}
                            />

                            {/* 📎 Audio File Upload */}
                            <input
                                type="file"
                                accept="audio/*"
                                ref={audioFileInputRef}
                                onChange={handleAudioFileSelect}
                                className="hidden"
                            />
                            <button
                                onClick={() => audioFileInputRef.current.click()}
                                className="px-4 py-3 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200"
                                title="Upload Audio File"
                                disabled={isProcessingAudio || isAsking}
                            >
                                <Paperclip size={20} />
                            </button>

                            {/* 🎤 Malayalam Voice Input (Direct Recording) */}
                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`px-4 py-3 rounded-lg transition-colors duration-200 ${isRecording
                                        ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                title="Record Audio (Malayalam/English)"
                                disabled={isProcessingAudio || isAsking}
                            >
                                <Mic size={20} />
                            </button>

                            <button
                                onClick={handleAskQuestion}
                                disabled={(!question.trim() && !selectedAudioFile) || isAsking || isProcessingAudio}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                            >
                                {(isAsking || isProcessingAudio) ?
                                    <Loader2 className="animate-spin" size={20} /> :
                                    <Send size={20} />
                                }
                            </button>
                        </div>

                        {isRecording && (
                            <div className="mt-2 text-center text-red-600 animate-pulse">
                                🎤 Recording... Click mic again to stop
                            </div>
                        )}

                        {isProcessingAudio && (
                            <div className="mt-2 text-center text-orange-600">
                                🔄 Processing audio file...
                            </div>
                        )}

                        {/* File Upload */}
                        <div className="mt-4 flex items-center space-x-2">
                            <input
                                type="file"
                                multiple
                                accept="application/pdf"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                disabled={isUploading}
                            >
                                Select PDFs ({selectedFiles.length})
                            </button>
                            <button
                                onClick={handleUploadPDFs}
                                disabled={selectedFiles.length === 0 || isUploading}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
                            >
                                {isUploading ? (
                                    <div className="flex items-center">
                                        <Loader2 className="animate-spin mr-2" size={16} />
                                        Uploading...
                                    </div>
                                ) : (
                                    'Upload PDFs'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                    <FileText className="mx-auto mb-3 text-green-600" size={32} />
                    <h3 className="font-semibold text-gray-800 mb-2">PDF Processing</h3>
                    <p className="text-gray-600 text-sm">
                        Upload agricultural documents and get intelligent answers based on the content
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                    <Paperclip className="mx-auto mb-3 text-orange-600" size={32} />
                    <h3 className="font-semibold text-gray-800 mb-2">Audio File Processing</h3>
                    <p className="text-gray-600 text-sm">
                        Upload audio files (WAV, MP3, etc.) for automatic transcription and answering
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                    <Mic className="mx-auto mb-3 text-blue-600" size={32} />
                    <h3 className="font-semibold text-gray-800 mb-2">Voice Input</h3>
                    <p className="text-gray-600 text-sm">
                        Ask questions using voice input for hands-free interaction in Malayalam or English
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                    <Volume2 className="mx-auto mb-3 text-purple-600" size={32} />
                    <h3 className="font-semibold text-gray-800 mb-2">Malayalam Translation</h3>
                    <p className="text-gray-600 text-sm">
                        Get answers translated to Malayalam with audio playback
                    </p>
                </div>
            </div>

            <PestAdvisory />
        </div>
    );
};

export default Advisory;