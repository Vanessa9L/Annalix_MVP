"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  LineChartIcon,
  BarChart2,
  PieChart,
  Database,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
  FileText,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Sample benchmark datasets
const benchmarkDatasets = [
  {
    id: "benchmark1",
    name: "通用对话评估集",
    description: "用于评估模型在通用对话场景中的表现",
    samples: 1000,
    categories: ["对话", "通用"],
    metrics: ["准确性", "流畅性", "相关性", "一致性"],
  },
  {
    id: "benchmark2",
    name: "知识问答评估集",
    description: "用于评估模型在知识问答任务中的表现",
    samples: 800,
    categories: ["问答", "知识"],
    metrics: ["准确性", "完整性", "简洁性"],
  },
  {
    id: "benchmark3",
    name: "情感分析评估集",
    description: "用于评估模型在情感分析任务中的表现",
    samples: 1200,
    categories: ["情感分析", "分类"],
    metrics: ["准确性", "召回率", "F1分数"],
  },
  {
    id: "benchmark4",
    name: "专业领域评估集",
    description: "用于评估模型在医疗、法律等专业领域的表现",
    samples: 600,
    categories: ["专业", "领域知识"],
    metrics: ["专业准确性", "术语使用", "推理能力"],
  },
  {
    id: "benchmark5",
    name: "多语言评估集",
    description: "用于评估模型在多语言环境下的表现",
    samples: 1500,
    categories: ["多语言", "翻译"],
    metrics: ["翻译准确性", "语法正确性", "文化适应性"],
  },
]

// Sample user datasets
const userDatasets = [
  {
    id: "dataset1",
    name: "大型语言模型训练数据集",
    description: "用于LLM训练的高质量对话数据集",
    samples: 100,
    quality: 85,
  },
  {
    id: "dataset2",
    name: "情感分析数据集",
    description: "中文社交媒体评论情感标注数据集",
    samples: 80,
    quality: 92,
  },
  {
    id: "dataset3",
    name: "问答系统数据集",
    description: "通用领域问答对数据集",
    samples: 120,
    quality: 78,
  },
  {
    id: "dataset4",
    name: "代码生成数据集",
    description: "编程语言代码生成训练数据集",
    samples: 95,
    quality: 88,
  },
]

// Sample evaluation metrics
const evaluationMetrics = [
  {
    name: "准确性",
    description: "评估数据的事实准确性和正确性",
    weight: 0.3,
  },
  {
    name: "完整性",
    description: "评估数据是否包含所有必要信息",
    weight: 0.2,
  },
  {
    name: "一致性",
    description: "评估数据内部的一致性和连贯性",
    weight: 0.15,
  },
  {
    name: "多样性",
    description: "评估数据的多样性和覆盖范围",
    weight: 0.15,
  },
  {
    name: "相关性",
    description: "评估数据与目标任务的相关程度",
    weight: 0.2,
  },
]

// Sample evaluation results
const generateEvaluationResults = (selectedDatasets: string[], selectedBenchmarks: string[]) => {
  if (selectedDatasets.length === 0 || selectedBenchmarks.length === 0) return []

  return selectedDatasets
    .map((datasetId) => {
      const dataset = userDatasets.find((d) => d.id === datasetId)
      if (!dataset) return null

      return {
        datasetId,
        datasetName: dataset.name,
        overallScore: Math.round((70 + Math.random() * 25) * 100) / 100,
        metrics: evaluationMetrics.map((metric) => ({
          name: metric.name,
          score: Math.round((65 + Math.random() * 30) * 100) / 100,
        })),
        benchmarkComparisons: selectedBenchmarks.map((benchmarkId) => {
          const benchmark = benchmarkDatasets.find((b) => b.id === benchmarkId)
          return {
            benchmarkId,
            benchmarkName: benchmark?.name || "",
            similarityScore: Math.round((60 + Math.random() * 35) * 100) / 100,
            strengths: ["覆盖范围广", "样本质量高"],
            weaknesses: ["特定领域样本不足", "边缘案例覆盖不全"],
          }
        }),
        recommendations: ["增加特定领域的样本数量", "提高数据多样性", "改进数据标注质量", "增加边缘案例覆盖"],
      }
    })
    .filter(Boolean)
}

type DataEvaluationDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DataEvaluationDialog({ open, onOpenChange }: DataEvaluationDialogProps) {
  const [activeTab, setActiveTab] = useState("configuration")
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([])
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<string[]>([])
  const [evaluationParameters, setEvaluationParameters] = useState({
    sampleSize: 100,
    confidenceLevel: 95,
    randomSeed: 42,
    crossValidation: true,
    folds: 5,
    metricWeights: evaluationMetrics.reduce(
      (acc, metric) => {
        acc[metric.name] = metric.weight
        return acc
      },
      {} as Record<string, number>,
    ),
  })
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluationProgress, setEvaluationProgress] = useState(0)
  const [evaluationResults, setEvaluationResults] = useState<any[]>([])
  const [selectedResult, setSelectedResult] = useState<string | null>(null)

  // Toggle dataset selection
  const toggleDataset = (datasetId: string) => {
    setSelectedDatasets((prev) =>
      prev.includes(datasetId) ? prev.filter((id) => id !== datasetId) : [...prev, datasetId],
    )
  }

  // Toggle benchmark selection
  const toggleBenchmark = (benchmarkId: string) => {
    setSelectedBenchmarks((prev) =>
      prev.includes(benchmarkId) ? prev.filter((id) => id !== benchmarkId) : [...prev, benchmarkId],
    )
  }

  // Update metric weight
  const updateMetricWeight = (metricName: string, weight: number) => {
    setEvaluationParameters((prev) => ({
      ...prev,
      metricWeights: {
        ...prev.metricWeights,
        [metricName]: weight,
      },
    }))
  }

  // Start evaluation
  const startEvaluation = () => {
    if (selectedDatasets.length === 0 || selectedBenchmarks.length === 0) return

    setIsEvaluating(true)
    setEvaluationProgress(0)
    setActiveTab("progress")

    // Simulate evaluation progress
    const interval = setInterval(() => {
      setEvaluationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsEvaluating(false)

          // Generate evaluation results
          const results = generateEvaluationResults(selectedDatasets, selectedBenchmarks)
          setEvaluationResults(results)

          // Set the first result as selected
          if (results.length > 0) {
            setSelectedResult(results[0].datasetId)
          }

          setActiveTab("results")
          return 100
        }
        return prev + 2
      })
    }, 200)
  }

  // Reset evaluation
  const resetEvaluation = () => {
    setIsEvaluating(false)
    setEvaluationProgress(0)
    setEvaluationResults([])
    setSelectedResult(null)
    setActiveTab("configuration")
  }

  // Export results
  const exportResults = (format: "json" | "csv") => {
    if (evaluationResults.length === 0) return

    let data: string
    let filename: string
    let contentType: string

    if (format === "json") {
      data = JSON.stringify(evaluationResults, null, 2)
      filename = `data-evaluation-results-${new Date().toISOString().slice(0, 10)}.json`
      contentType = "application/json"
    } else {
      // Create CSV content
      const headers = [
        "Dataset",
        "Overall Score",
        "Benchmark",
        "Similarity Score",
        "Strengths",
        "Weaknesses",
        "Recommendations",
      ]

      const rows = evaluationResults.flatMap((result) =>
        result.benchmarkComparisons.map((comparison: any) => [
          result.datasetName,
          result.overallScore,
          comparison.benchmarkName,
          comparison.similarityScore,
          comparison.strengths.join("; "),
          comparison.weaknesses.join("; "),
          result.recommendations.join("; "),
        ]),
      )

      data = [headers, ...rows].map((row) => row.join(",")).join("\n")
      filename = `data-evaluation-results-${new Date().toISOString().slice(0, 10)}.csv`
      contentType = "text/csv"
    }

    // Create and trigger download
    const blob = new Blob([data], { type: contentType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Get selected result
  const getSelectedResult = () => {
    if (!selectedResult) return null
    return evaluationResults.find((result) => result.datasetId === selectedResult)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">数据评估</DialogTitle>
          <DialogDescription>评估您的数据集质量，与基准数据集进行比较，并获取改进建议</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configuration" disabled={isEvaluating}>
              <Settings className="h-4 w-4 mr-2" />
              评估配置
            </TabsTrigger>
            <TabsTrigger value="progress" disabled={!isEvaluating && evaluationProgress === 0}>
              <LineChartIcon className="h-4 w-4 mr-2" />
              评估进度
            </TabsTrigger>
            <TabsTrigger value="results" disabled={evaluationResults.length === 0}>
              <BarChart2 className="h-4 w-4 mr-2" />
              评估结果
            </TabsTrigger>
          </TabsList>

          {/* Configuration Tab */}
          <TabsContent value="configuration" className="space-y-6 mt-4 overflow-hidden flex-1">
            <ScrollArea className="h-[calc(90vh-12rem)]">
              <div className="space-y-6 pr-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Dataset Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        选择数据集
                      </CardTitle>
                      <CardDescription>选择要评估的数据集</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
                      <ScrollArea className="h-[150px] sm:h-[200px] pr-4">
                        <div className="space-y-2">
                          {userDatasets.map((dataset) => (
                            <div
                              key={dataset.id}
                              className={cn(
                                "flex items-start space-x-2 p-2 rounded-md transition-colors",
                                selectedDatasets.includes(dataset.id)
                                  ? "bg-muted/50 border border-primary/20"
                                  : "hover:bg-muted/30",
                              )}
                            >
                              <Checkbox
                                id={`dataset-${dataset.id}`}
                                checked={selectedDatasets.includes(dataset.id)}
                                onCheckedChange={() => toggleDataset(dataset.id)}
                              />
                              <div className="space-y-1">
                                <Label htmlFor={`dataset-${dataset.id}`} className="font-medium cursor-pointer">
                                  {dataset.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">{dataset.description}</p>
                                <div className="flex items-center gap-2 text-xs">
                                  <Badge variant="outline" className="text-xs">
                                    {dataset.samples} 样本
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs",
                                      dataset.quality >= 90
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : dataset.quality >= 80
                                          ? "bg-blue-50 text-blue-700 border-blue-200"
                                          : "bg-yellow-50 text-yellow-700 border-yellow-200",
                                    )}
                                  >
                                    质量 {dataset.quality}%
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Benchmark Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Layers className="h-4 w-4 mr-2" />
                        选择基准数据集
                      </CardTitle>
                      <CardDescription>选择用于比较的基准数据集</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
                      <ScrollArea className="h-[150px] sm:h-[200px] pr-4">
                        <div className="space-y-2">
                          {benchmarkDatasets.map((benchmark) => (
                            <div
                              key={benchmark.id}
                              className={cn(
                                "flex items-start space-x-2 p-2 rounded-md transition-colors",
                                selectedBenchmarks.includes(benchmark.id)
                                  ? "bg-muted/50 border border-primary/20"
                                  : "hover:bg-muted/30",
                              )}
                            >
                              <Checkbox
                                id={`benchmark-${benchmark.id}`}
                                checked={selectedBenchmarks.includes(benchmark.id)}
                                onCheckedChange={() => toggleBenchmark(benchmark.id)}
                              />
                              <div className="space-y-1">
                                <Label htmlFor={`benchmark-${benchmark.id}`} className="font-medium cursor-pointer">
                                  {benchmark.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">{benchmark.description}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {benchmark.categories.map((category) => (
                                    <Badge key={category} variant="secondary" className="text-xs">
                                      {category}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Evaluation Parameters */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      评估参数
                    </CardTitle>
                    <CardDescription>自定义评估参数设置</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="sample-size">样本大小</Label>
                            <span className="text-sm text-muted-foreground">{evaluationParameters.sampleSize}</span>
                          </div>
                          <Slider
                            id="sample-size"
                            min={10}
                            max={500}
                            step={10}
                            value={[evaluationParameters.sampleSize]}
                            onValueChange={([value]) =>
                              setEvaluationParameters((prev) => ({ ...prev, sampleSize: value }))
                            }
                          />
                          <p className="text-xs text-muted-foreground">用于评估的样本数量</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="confidence-level">置信水平</Label>
                            <span className="text-sm text-muted-foreground">
                              {evaluationParameters.confidenceLevel}%
                            </span>
                          </div>
                          <Slider
                            id="confidence-level"
                            min={80}
                            max={99}
                            step={1}
                            value={[evaluationParameters.confidenceLevel]}
                            onValueChange={([value]) =>
                              setEvaluationParameters((prev) => ({ ...prev, confidenceLevel: value }))
                            }
                          />
                          <p className="text-xs text-muted-foreground">评估结果的统计置信水平</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="random-seed">随机种子</Label>
                          <Input
                            id="random-seed"
                            type="number"
                            value={evaluationParameters.randomSeed}
                            onChange={(e) =>
                              setEvaluationParameters((prev) => ({
                                ...prev,
                                randomSeed: Number.parseInt(e.target.value) || 0,
                              }))
                            }
                          />
                          <p className="text-xs text-muted-foreground">用于确保评估结果可重现</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="cross-validation"
                            checked={evaluationParameters.crossValidation}
                            onCheckedChange={(checked) =>
                              setEvaluationParameters((prev) => ({ ...prev, crossValidation: !!checked }))
                            }
                          />
                          <div className="space-y-1">
                            <Label htmlFor="cross-validation">启用交叉验证</Label>
                            <p className="text-xs text-muted-foreground">使用K折交叉验证提高评估可靠性</p>
                          </div>
                        </div>

                        {evaluationParameters.crossValidation && (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="folds">交叉验证折数</Label>
                              <span className="text-sm text-muted-foreground">{evaluationParameters.folds}</span>
                            </div>
                            <Slider
                              id="folds"
                              min={2}
                              max={10}
                              step={1}
                              value={[evaluationParameters.folds]}
                              onValueChange={([value]) =>
                                setEvaluationParameters((prev) => ({ ...prev, folds: value }))
                              }
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">指标权重</h3>
                        <div className="space-y-4">
                          {evaluationMetrics.map((metric) => (
                            <div key={metric.name} className="space-y-2">
                              <div className="flex justify-between">
                                <Label htmlFor={`metric-${metric.name}`}>{metric.name}</Label>
                                <span className="text-sm text-muted-foreground">
                                  {evaluationParameters.metricWeights[metric.name].toFixed(2)}
                                </span>
                              </div>
                              <Slider
                                id={`metric-${metric.name}`}
                                min={0}
                                max={1}
                                step={0.05}
                                value={[evaluationParameters.metricWeights[metric.name]]}
                                onValueChange={([value]) => updateMetricWeight(metric.name, value)}
                              />
                              <p className="text-xs text-muted-foreground">{metric.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={startEvaluation}
                    disabled={selectedDatasets.length === 0 || selectedBenchmarks.length === 0}
                    className="bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] hover:opacity-90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    开始评估
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6 mt-4 overflow-hidden flex-1">
            <ScrollArea className="h-[calc(90vh-12rem)]">
              <div className="space-y-6 pr-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <LineChartIcon className="h-4 w-4 mr-2" />
                      评估进度
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>总体进度</span>
                        <span>{evaluationProgress}%</span>
                      </div>
                      <Progress value={evaluationProgress} />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">当前评估数据集</h3>
                      <div className="space-y-2">
                        {selectedDatasets.map((datasetId, index) => {
                          const dataset = userDatasets.find((d) => d.id === datasetId)
                          if (!dataset) return null

                          // Calculate progress for this dataset
                          const datasetProgress = Math.min(
                            100,
                            evaluationProgress * (selectedDatasets.length / (index + 1)),
                          )

                          return (
                            <div key={datasetId} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{dataset.name}</span>
                                <span>{Math.min(100, datasetProgress).toFixed(0)}%</span>
                              </div>
                              <Progress value={Math.min(100, datasetProgress)} className="h-2" />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">评估日志</h3>
                      <ScrollArea className="h-[200px] w-full border rounded-md bg-muted/20 p-4">
                        <div className="space-y-2 font-mono text-xs">
                          <div className="text-blue-600">[INFO] 开始数据评估流程...</div>
                          {evaluationProgress >= 10 && (
                            <div className="text-green-600">
                              [SUCCESS] 已加载 {selectedDatasets.length} 个数据集和 {selectedBenchmarks.length}{" "}
                              个基准数据集
                            </div>
                          )}
                          {evaluationProgress >= 20 && <div>[INFO] 正在准备评估参数...</div>}
                          {evaluationProgress >= 30 && (
                            <div className="text-green-600">[SUCCESS] 评估参数已配置完成</div>
                          )}
                          {evaluationProgress >= 40 && (
                            <div>
                              [INFO] 开始数据集 "{userDatasets.find((d) => d.id === selectedDatasets[0])?.name}"
                              的评估...
                            </div>
                          )}
                          {evaluationProgress >= 50 && (
                            <div className="text-yellow-600">[WARNING] 发现部分样本存在缺失值，将使用插值方法处理</div>
                          )}
                          {evaluationProgress >= 60 && (
                            <div className="text-green-600">
                              [SUCCESS] 已完成数据集 "{userDatasets.find((d) => d.id === selectedDatasets[0])?.name}"
                              的评估
                            </div>
                          )}
                          {evaluationProgress >= 70 && selectedDatasets.length > 1 && (
                            <div>
                              [INFO] 开始数据集 "{userDatasets.find((d) => d.id === selectedDatasets[1])?.name}"
                              的评估...
                            </div>
                          )}
                          {evaluationProgress >= 80 && selectedDatasets.length > 1 && (
                            <div className="text-green-600">
                              [SUCCESS] 已完成数据集 "{userDatasets.find((d) => d.id === selectedDatasets[1])?.name}"
                              的评估
                            </div>
                          )}
                          {evaluationProgress >= 90 && <div>[INFO] 正在生成评估报告...</div>}
                          {evaluationProgress >= 100 && (
                            <div className="text-green-600">[SUCCESS] 评估完成！已生成评估报告</div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>

                    <div className="flex justify-end gap-2">
                      {isEvaluating ? (
                        <Button variant="outline" onClick={() => setIsEvaluating(false)}>
                          <Pause className="h-4 w-4 mr-2" />
                          暂停评估
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => setIsEvaluating(true)}
                          disabled={evaluationProgress >= 100}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          继续评估
                        </Button>
                      )}
                      <Button variant="outline" onClick={resetEvaluation}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        重置评估
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6 mt-4 overflow-hidden flex-1">
            <ScrollArea className="h-[calc(90vh-12rem)]">
              <div className="space-y-6 pr-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Results List */}
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        评估结果列表
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-2">
                          {evaluationResults.map((result) => (
                            <div
                              key={result.datasetId}
                              className={cn(
                                "p-3 rounded-md border cursor-pointer transition-colors",
                                selectedResult === result.datasetId
                                  ? "border-primary bg-muted/50"
                                  : "hover:bg-muted/30",
                              )}
                              onClick={() => setSelectedResult(result.datasetId)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="text-sm font-medium">{result.datasetName}</div>
                                <Badge
                                  variant={
                                    result.overallScore > 90
                                      ? "success"
                                      : result.overallScore > 75
                                        ? "default"
                                        : "destructive"
                                  }
                                >
                                  {result.overallScore}
                                </Badge>
                              </div>
                              <div className="mt-2 space-y-1">
                                <div className="text-xs text-muted-foreground">
                                  与 {result.benchmarkComparisons.length} 个基准数据集比较
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {result.metrics.slice(0, 3).map((metric: any) => (
                                    <Badge key={metric.name} variant="outline" className="text-xs">
                                      {metric.name}: {metric.score}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Result Details */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center justify-between">
                        <div className="flex items-center">
                          <BarChart2 className="h-4 w-4 mr-2" />
                          详细评估结果
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => exportResults("csv")}>
                            <FileText className="h-4 w-4 mr-1" />
                            导出CSV
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => exportResults("json")}>
                            <Download className="h-4 w-4 mr-1" />
                            导出JSON
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
                      {getSelectedResult() ? (
                        <Tabs defaultValue="overview" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview">
                              <PieChart className="h-4 w-4 mr-2" />
                              总览
                            </TabsTrigger>
                            <TabsTrigger value="metrics">
                              <BarChart2 className="h-4 w-4 mr-2" />
                              指标详情
                            </TabsTrigger>
                            <TabsTrigger value="recommendations">
                              <Info className="h-4 w-4 mr-2" />
                              改进建议
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="overview" className="space-y-4 mt-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium">{getSelectedResult()?.datasetName}</h3>
                              <Badge
                                variant={
                                  getSelectedResult()?.overallScore > 90
                                    ? "success"
                                    : getSelectedResult()?.overallScore > 75
                                      ? "default"
                                      : "destructive"
                                }
                                className="text-lg px-3 py-1"
                              >
                                总分: {getSelectedResult()?.overallScore}
                              </Badge>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                              <div>
                                <h4 className="text-sm font-medium mb-2">指标评分</h4>
                                <div className="h-[200px] sm:h-[250px]">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                      data={getSelectedResult()?.metrics}
                                      layout="vertical"
                                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis type="number" domain={[0, 100]} />
                                      <YAxis dataKey="name" type="category" width={80} />
                                      <Tooltip formatter={(value) => [`${value}`, "评分"]} />
                                      <Bar dataKey="score" fill="#8884d8" />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-2">与基准数据集相似度</h4>
                                <div className="h-[200px] sm:h-[250px]">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                      data={getSelectedResult()?.benchmarkComparisons}
                                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="benchmarkName" />
                                      <YAxis domain={[0, 100]} />
                                      <Tooltip formatter={(value) => [`${value}%`, "相似度"]} />
                                      <Bar dataKey="similarityScore" fill="#82ca9d" />
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">能力雷达图</h4>
                              <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <RadarChart outerRadius={90} data={getSelectedResult()?.metrics}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="name" />
                                    <PolarRadiusAxis domain={[0, 100]} />
                                    <Radar
                                      name="当前数据集"
                                      dataKey="score"
                                      stroke="#8884d8"
                                      fill="#8884d8"
                                      fillOpacity={0.6}
                                    />
                                    <Legend />
                                  </RadarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="metrics" className="space-y-4 mt-4">
                            <div className="border rounded-md">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>指标</TableHead>
                                    <TableHead>评分</TableHead>
                                    <TableHead>等级</TableHead>
                                    <TableHead>详情</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {getSelectedResult()?.metrics.map((metric: any) => (
                                    <TableRow key={metric.name}>
                                      <TableCell className="font-medium">{metric.name}</TableCell>
                                      <TableCell>{metric.score}</TableCell>
                                      <TableCell>
                                        <Badge
                                          variant={
                                            metric.score > 90
                                              ? "success"
                                              : metric.score > 75
                                                ? "default"
                                                : "destructive"
                                          }
                                        >
                                          {metric.score > 90 ? "优秀" : metric.score > 75 ? "良好" : "需改进"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-muted-foreground">
                                        {metric.name === "准确性" && "数据的事实准确性和正确性评分"}
                                        {metric.name === "完整性" && "数据包含所有必要信息的完整程度"}
                                        {metric.name === "一致性" && "数据内部的一致性和连贯性评分"}
                                        {metric.name === "多样性" && "数据的多样性和覆盖范围评分"}
                                        {metric.name === "相关性" && "数据与目标任务的相关程度评分"}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            <div className="space-y-4">
                              <h4 className="text-sm font-medium">与基准数据集比较</h4>
                              {getSelectedResult()?.benchmarkComparisons.map((comparison: any) => (
                                <Card key={comparison.benchmarkId}>
                                  <CardHeader className="py-3">
                                    <CardTitle className="text-base flex items-center justify-between">
                                      <span>{comparison.benchmarkName}</span>
                                      <Badge variant="outline">相似度: {comparison.similarityScore}%</Badge>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="py-3">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                      <div>
                                        <h5 className="text-sm font-medium mb-2 flex items-center">
                                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                          优势
                                        </h5>
                                        <ul className="space-y-1 text-sm">
                                          {comparison.strengths.map((strength: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2">
                                              <span className="text-green-500">•</span>
                                              <span>{strength}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <h5 className="text-sm font-medium mb-2 flex items-center">
                                          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                                          劣势
                                        </h5>
                                        <ul className="space-y-1 text-sm">
                                          {comparison.weaknesses.map((weakness: string, index: number) => (
                                            <li key={index} className="flex items-start gap-2">
                                              <span className="text-red-500">•</span>
                                              <span>{weakness}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>

                          <TabsContent value="recommendations" className="space-y-4 mt-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base">改进建议</CardTitle>
                                <CardDescription>基于评估结果，我们为您提供以下改进建议</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-4">
                                  {getSelectedResult()?.recommendations.map((recommendation: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        {index + 1}
                                      </div>
                                      <div className="space-y-1">
                                        <p className="font-medium">{recommendation}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {index === 0 &&
                                            "增加特定领域的样本可以提高模型在这些领域的表现，建议针对性收集更多相关数据。"}
                                          {index === 1 &&
                                            "提高数据多样性可以增强模型的泛化能力，建议增加不同来源、不同风格的数据。"}
                                          {index === 2 &&
                                            "高质量的数据标注对模型训练至关重要，建议优化标注流程，提高标注质量。"}
                                          {index === 3 &&
                                            "边缘案例对测试模型的鲁棒性很重要，建议增加一些特殊情况和极端案例。"}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base">行动计划</CardTitle>
                                <CardDescription>根据评估结果，我们为您制定了以下行动计划</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <h4 className="text-sm font-medium">短期行动（1-2周）</h4>
                                    <ul className="space-y-1 text-sm">
                                      <li className="flex items-start gap-2">
                                        <span className="text-blue-500">•</span>
                                        <span>对现有数据进行质量审核，修复明显的错误和问题</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="text-blue-500">•</span>
                                        <span>优化数据标注指南，提高标注一致性</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="text-blue-500">•</span>
                                        <span>实施基本的数据增强技术，扩充现有数据集</span>
                                      </li>
                                    </ul>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="text-sm font-medium">中期行动（1-3个月）</h4>
                                    <ul className="space-y-1 text-sm">
                                      <li className="flex items-start gap-2">
                                        <span className="text-purple-500">•</span>
                                        <span>收集更多特定领域的数据，填补当前数据集的空白</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="text-purple-500">•</span>
                                        <span>开发自动化数据质量检查工具，提高数据处理效率</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="text-purple-500">•</span>
                                        <span>建立定期数据评估机制，持续监控数据质量</span>
                                      </li>
                                    </ul>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="text-sm font-medium">长期行动（3-6个月）</h4>
                                    <ul className="space-y-1 text-sm">
                                      <li className="flex items-start gap-2">
                                        <span className="text-green-500">•</span>
                                        <span>建立完整的数据管理流程，包括采集、清洗、标注、验证和更新</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="text-green-500">•</span>
                                        <span>开发数据合成技术，生成高质量的合成数据补充真实数据</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="text-green-500">•</span>
                                        <span>建立数据共享和协作机制，促进团队间的数据交流</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </TabsContent>
                        </Tabs>
                      ) : (
                        <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                          <div className="text-center">
                            <BarChart2 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>请从左侧选择一个评估结果查看详情</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-shrink-0 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
          {evaluationResults.length > 0 && (
            <Button
              className="bg-gradient-to-r from-[#a8b2d1] to-[#d1a8c4] hover:opacity-90"
              onClick={() => exportResults("json")}
            >
              <Download className="h-4 w-4 mr-2" />
              导出评估报告
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

