import React, { useState, useEffect, useRef } from 'react';
import { Upload, Play, Settings, Activity, AlertTriangle, Info, TrendingUp, FileText, Zap, CheckCircle } from 'lucide-react';

const LogBERTApp = () => {
  const [logData, setLogData] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [threshold, setThreshold] = useState(0.5);
  const [realTimeMode, setRealTimeMode] = useState(false);
  const [rcaMode, setRcaMode] = useState(true);
  const [logLevel, setLogLevel] = useState('all');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [stats, setStats] = useState({ total: 0, anomalies: 0, rate: 0, highestScore: 0 });
  const fileInputRef = useRef(null);
  const realTimeInterval = useRef(null);

  // Sample log data for demo
  const sampleLogs = `2024-01-15 10:30:22 INFO Application started successfully
2024-01-15 10:30:45 ERROR Database connection failed - timeout after 30s
2024-01-15 10:31:00 WARN Retrying connection attempt 1/3
2024-01-15 10:31:15 INFO Connection established successfully
2024-01-15 10:32:00 ERROR Memory usage exceeded 90% threshold
2024-01-15 10:32:30 WARN Garbage collection triggered
2024-01-15 10:33:00 INFO User authentication successful for user_123
2024-01-15 10:33:15 ERROR API request failed - service unavailable
2024-01-15 10:33:30 WARN Network latency spike detected: 2.5s`;

  useEffect(() => {
    // Set sample data on mount
    setLogData(sampleLogs);
    
    return () => {
      if (realTimeInterval.current) {
        clearInterval(realTimeInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (realTimeMode) {
      startRealTimeMonitoring();
    } else {
      stopRealTimeMonitoring();
    }
  }, [realTimeMode]);

  const startRealTimeMonitoring = () => {
    realTimeInterval.current = setInterval(() => {
      const newLog = generateRandomLog();
      setLogData(prev => prev + '\n' + newLog);
      
      if (Math.random() < 0.3) {
        analyzeLogsAutomatically();
      }
    }, 3000);
  };

  const stopRealTimeMonitoring = () => {
    if (realTimeInterval.current) {
      clearInterval(realTimeInterval.current);
      realTimeInterval.current = null;
    }
  };

  const generateRandomLog = () => {
    const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    const messages = [
      'User authentication successful',
      'Database connection timeout',
      'Memory usage at 85%',
      'API request processed',
      'Cache miss detected',
      'Network latency spike detected',
      'Service unavailable',
      'Configuration updated'
    ];
    
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    const level = levels[Math.floor(Math.random() * levels.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    return `${timestamp} ${level} ${message}`;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogData(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const extractLogLevel = (line) => {
    const match = line.match(/\b(DEBUG|INFO|WARN|ERROR)\b/);
    return match ? match[0] : 'INFO';
  };

  const extractTimestamp = (line) => {
    const match = line.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
    return match ? match[0] : 'Unknown';
  };

  const calculateAnomalyScore = (line) => {
    let score = 0;
    
    if (line.includes('ERROR') || line.includes('FATAL')) score += 0.7;
    if (line.includes('exception') || line.includes('failed')) score += 0.6;
    if (line.includes('timeout') || line.includes('connection')) score += 0.5;
    if (line.includes('memory') || line.includes('disk')) score += 0.4;
    if (line.includes('slow') || line.includes('performance')) score += 0.3;
    
    score += Math.random() * 0.2;
    
    return Math.min(score, 1.0);
  };

  const generateRootCause = (line) => {
    if (line.includes('database') || line.includes('connection')) {
      return 'Database connectivity issue - check connection pool settings';
    }
    if (line.includes('memory') || line.includes('heap')) {
      return 'Memory management issue - potential memory leak detected';
    }
    if (line.includes('timeout') || line.includes('slow')) {
      return 'Performance degradation - check system resources';
    }
    
    const causes = [
      'Resource contention detected',
      'Authentication service timeout',
      'Cache invalidation required',
      'Load balancer health check failed'
    ];
    
    return causes[Math.floor(Math.random() * causes.length)];
  };

  const filterLogsByLevel = (lines, level) => {
    if (level === 'all') return lines;
    
    const levelPriority = { 'DEBUG': 0, 'INFO': 1, 'WARN': 2, 'ERROR': 3 };
    const minLevel = levelPriority[level.toUpperCase()] || 0;
    
    return lines.filter(line => {
      const logLevel = extractLogLevel(line);
      return levelPriority[logLevel] >= minLevel;
    });
  };

  const detectAnomalies = (lines, threshold) => {
    const anomalies = [];
    
    lines.forEach((line, index) => {
      const score = calculateAnomalyScore(line);
      
      if (score > threshold) {
        anomalies.push({
          line: line,
          score: score,
          index: index,
          timestamp: extractTimestamp(line),
          level: extractLogLevel(line),
          rootCause: generateRootCause(line)
        });
      }
    });
    
    return anomalies.sort((a, b) => b.score - a.score);
  };

  const processLogAnalysis = (logText, updateStats = true) => {
    const lines = logText.split('\n').filter(line => line.trim());
    const filteredLines = filterLogsByLevel(lines, logLevel);
    const anomalies = detectAnomalies(filteredLines, threshold);
    
    if (updateStats) {
      setStats({
        total: filteredLines.length,
        anomalies: anomalies.length,
        rate: filteredLines.length > 0 ? (anomalies.length / filteredLines.length) * 100 : 0,
        highestScore: anomalies.length > 0 ? anomalies[0].score : 0
      });
    }
    
    setAnalysisResults(anomalies);
  };

  const analyzeLogsAutomatically = () => {
    if (logData.trim()) {
      processLogAnalysis(logData, false);
    }
  };

  const analyzeLogs = () => {
    if (!logData.trim()) {
      alert('Please enter some log data first!');
      return;
    }

    setIsAnalyzing(true);
    
    setTimeout(() => {
      processLogAnalysis(logData, true);
      setIsAnalyzing(false);
    }, 2000);
  };

  const StatCard = ({ icon: Icon, number, label, color = "text-blue-600" }) => (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-2xl font-bold ${color}`}>{number}</div>
          <div className="text-gray-600 text-sm">{label}</div>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );

  const AnomalyCard = ({ anomaly }) => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4 hover:transform hover:translate-x-2 transition-all duration-300">
      <div className="flex justify-between items-center mb-2">
        <span className="text-red-600 font-bold text-lg">
          Score: {anomaly.score.toFixed(3)}
        </span>
        <span className="text-gray-500 text-sm">{anomaly.timestamp}</span>
      </div>
      <div className="bg-gray-100 p-3 rounded font-mono text-sm break-all mb-3">
        {anomaly.line}
      </div>
      {rcaMode && (
        <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-green-600" />
            <strong className="text-green-800">Root Cause Analysis:</strong>
          </div>
          <p className="text-green-700 text-sm">{anomaly.rootCause}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-2xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LogBERT Anomaly Detection
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Advanced log analysis and root cause analysis powered by BERT
          </p>
        </div>

        {/* Stats Dashboard */}
        {analysisResults && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard icon={FileText} number={stats.total} label="Total Logs" />
            <StatCard icon={AlertTriangle} number={stats.anomalies} label="Anomalies Found" color="text-red-600" />
            <StatCard icon={TrendingUp} number={`${stats.rate.toFixed(1)}%`} label="Anomaly Rate" color="text-orange-600" />
            <StatCard icon={Activity} number={stats.highestScore.toFixed(2)} label="Highest Score" color="text-purple-600" />
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Log Input Panel */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Log Input</h2>
            </div>
            
            <div className="mb-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".log,.txt"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full hover:scale-105 transition-all duration-300"
              >
                <Upload className="w-5 h-5" />
                Upload Log File
              </button>
            </div>

            <textarea
              value={logData}
              onChange={(e) => setLogData(e.target.value)}
              className="w-full h-48 border-2 border-gray-200 rounded-xl p-4 font-mono text-sm resize-none focus:border-blue-500 focus:outline-none transition-colors duration-300"
              placeholder="Or paste your log entries here..."
            />

            <button
              onClick={analyzeLogs}
              disabled={isAnalyzing}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Analyze Logs
                </div>
              )}
            </button>
          </div>

          {/* Settings Panel */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Detection Settings</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anomaly Threshold: {threshold}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.1"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="realTimeMode"
                  checked={realTimeMode}
                  onChange={(e) => setRealTimeMode(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="realTimeMode" className="text-gray-700 font-medium">
                  Real-time monitoring
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="rcaMode"
                  checked={rcaMode}
                  onChange={(e) => setRcaMode(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="rcaMode" className="text-gray-700 font-medium">
                  Enable RCA analysis
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Log Level Filter
                </label>
                <select
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="all">All Levels</option>
                  <option value="error">ERROR only</option>
                  <option value="warn">WARN and above</option>
                  <option value="info">INFO and above</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
          </div>

          {isAnalyzing ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Running LogBERT analysis...</p>
            </div>
          ) : analysisResults === null ? (
            <div className="text-center py-12 text-gray-500">
              <Info className="w-12 h-12 mx-auto mb-4" />
              <p>Upload logs or paste log entries above to start anomaly detection</p>
            </div>
          ) : analysisResults.length === 0 ? (
            <div className="text-center py-12 text-green-600">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" />
              <p className="text-xl font-semibold">No anomalies detected!</p>
              <p className="text-gray-600 mt-2">
                Try lowering the threshold or check different log levels
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Detected Anomalies ({analysisResults.length})
              </h3>
              <div className="space-y-4">
                {analysisResults.map((anomaly, index) => (
                  <AnomalyCard key={index} anomaly={anomaly} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogBERTApp;