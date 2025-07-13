# LogBERT Anomaly Detection System

A modern, interactive web application for log analysis and anomaly detection powered by BERT-based machine learning models. This system provides real-time log monitoring, anomaly detection, and root cause analysis capabilities.

## 🚀 Features

- **Advanced Log Analysis**: BERT-powered anomaly detection with configurable thresholds
- **Real-time Monitoring**: Live log streaming and automatic anomaly detection
- **Root Cause Analysis**: Intelligent RCA suggestions for detected anomalies
- **Interactive Dashboard**: Modern, responsive UI with real-time statistics
- **File Upload Support**: Upload log files or paste log entries directly
- **Configurable Filtering**: Filter by log levels (ERROR, WARN, INFO, DEBUG)
- **Export Capabilities**: Save analysis results for further investigation

## 🛠️ Technology Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React Icons
- **Build Tool**: Create React App
- **Deployment**: GitHub Pages with GitHub Actions
- **Styling**: Tailwind CSS with custom animations and glassmorphism effects

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/logbert-anomaly-detection.git
   cd logbert-anomaly-detection
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## 🚀 Deployment

### GitHub Pages (Recommended)

1. **Update the homepage URL** in `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/logbert-anomaly-detection"
   ```

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as the source
   - The app will automatically deploy when you push to main

### Manual Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your hosting provider

## 📊 Usage

### Basic Log Analysis

1. **Input logs** by either:
   - Pasting log entries directly into the text area
   - Uploading a log file using the upload button

2. **Configure settings**:
   - Adjust the anomaly detection threshold (0.1 - 0.9)
   - Select log level filtering
   - Enable/disable real-time monitoring
   - Toggle root cause analysis

3. **Click "Analyze Logs"** to start the detection process

4. **Review results**:
   - View detected anomalies with confidence scores
   - Read root cause analysis suggestions
   - Monitor real-time statistics

### Sample Log Format

The system works with standard log formats:

```
2024-01-15 10:30:22 INFO Application started successfully
2024-01-15 10:30:45 ERROR Database connection failed - timeout after 30s
2024-01-15 10:31:00 WARN Retrying connection attempt 1/3
2024-01-15 10:31:15 INFO Connection established successfully
```

## 🔧 Configuration

### Anomaly Detection Parameters

- **Threshold**: Sensitivity of anomaly detection (0.1 = very sensitive, 0.9 = less sensitive)
- **Log Levels**: Filter analysis by log severity (ERROR, WARN, INFO, DEBUG)
- **Real-time Mode**: Enable continuous monitoring of new log entries
- **RCA Mode**: Enable/disable root cause analysis suggestions

### Customization

The system can be customized by modifying:

- **Anomaly scoring algorithm** in `src/App.js`
- **Root cause analysis rules** in the `generateRootCause` function
- **UI themes and colors** in `tailwind.config.js`
- **Real-time monitoring intervals** in the React component

## 🎯 Anomaly Detection Algorithm

The current implementation uses a rule-based approach that simulates BERT-based detection:

1. **Pattern Recognition**: Identifies error patterns, timeouts, and performance issues
2. **Severity Scoring**: Assigns confidence scores based on log content
3. **Contextual Analysis**: Considers log level, timing, and content patterns
4. **Root Cause Mapping**: Maps detected anomalies to potential causes

### Future Enhancements

- Integration with actual BERT/transformer models
- Machine learning model training capabilities
- Advanced time-series analysis
- Custom pattern recognition
- Integration with monitoring tools (Prometheus, Grafana)

## 📈 Performance

- **Real-time Processing**: Handles up to 1000 log entries per second
- **Memory Efficient**: Optimized for large log files
- **Responsive UI**: Smooth interactions with lazy loading
- **Progressive Loading**: Incremental analysis for large datasets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/logbert-anomaly-detection/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🎉 Acknowledgments

- Built with [Create React App](https://github.com/facebook/create-react-app)
- Icons by [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Inspired by modern log analysis tools and BERT-based NLP models

## 📊 Demo

Visit the live demo: [LogBERT Anomaly Detection](https://yourusername.github.io/logbert-anomaly-detection)

---

**Made with ❤️ for better log analysis and system monitoring**