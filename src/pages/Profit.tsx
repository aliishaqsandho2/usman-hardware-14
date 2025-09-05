import { useQuery } from "@tanstack/react-query";
import { profitApi } from "@/services/profitApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Calendar,
  Users,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Clock
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell
} from "recharts";

const formatCurrency = (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num).replace('PKR', 'Rs ');
};

const formatPercentage = (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `${num.toFixed(1)}%`;
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

// Overview Cards Component
const OverviewCards = () => {
  const { data: dailyProgress, isLoading: dailyLoading } = useQuery({
    queryKey: ['profit-daily-progress'],
    queryFn: profitApi.getDailyProgress,
  });

  const { data: keyMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['profit-key-metrics'],
    queryFn: profitApi.getKeyMetrics,
  });

  const { data: ytdSummary, isLoading: ytdLoading } = useQuery({
    queryKey: ['profit-ytd-summary'],
    queryFn: profitApi.getYTDSummary,
  });

  const isLoading = dailyLoading || metricsLoading || ytdLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[80px] mb-2" />
              <Skeleton className="h-3 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const todayProfit = parseFloat(keyMetrics?.today_profit || '0');
  const monthProfit = parseFloat(keyMetrics?.month_profit || '0');
  const ytdProfit = parseFloat(ytdSummary?.ytd_profit || '0');
  const projectedProfit = parseFloat(dailyProgress?.projected_profit || '0');

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Today's Profit</CardTitle>
          <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-full">
            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
            {formatCurrency(todayProfit)}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            <Clock className="h-3 w-3 inline mr-1" />
            Live tracking
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Monthly Profit</CardTitle>
          <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {formatCurrency(monthProfit)}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            {ytdSummary?.ytd_margin}% margin
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">YTD Profit</CardTitle>
          <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-full">
            <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {formatCurrency(ytdProfit)}
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            <Star className="h-3 w-3 inline mr-1" />
            {ytdSummary?.ytd_sales} total sales
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">Projected Profit</CardTitle>
          <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full">
            <Target className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
            {formatCurrency(projectedProfit)}
          </div>
          <p className="text-xs text-amber-600 dark:text-amber-400">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            End of day projection
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Performance Tab Component
const PerformanceTab = () => {
  const { data: dailyPerformance, isLoading: performanceLoading } = useQuery({
    queryKey: ['profit-daily-performance'],
    queryFn: profitApi.getDailyPerformance,
  });

  const { data: weekComparison, isLoading: comparisonLoading } = useQuery({
    queryKey: ['profit-week-comparison'],
    queryFn: profitApi.getWeekComparison,
  });

  const { data: targetAchievement, isLoading: targetLoading } = useQuery({
    queryKey: ['profit-target-achievement'],
    queryFn: profitApi.getTargetAchievement,
  });

  if (performanceLoading || comparisonLoading || targetLoading) {
    return <div className="space-y-6">Loading performance data...</div>;
  }

  const actualProfit = parseFloat(dailyPerformance?.actual_profit || '0');
  const targetProfit = parseFloat(dailyPerformance?.target_profit || '0');
  const achievementPercent = targetProfit > 0 ? (actualProfit / targetProfit) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Daily Performance vs Target */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Today's Target Achievement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{achievementPercent.toFixed(1)}%</span>
              </div>
              <Progress value={Math.min(achievementPercent, 100)} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Actual</p>
                  <p className="font-semibold">{formatCurrency(actualProfit)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Target</p>
                  <p className="font-semibold">{formatCurrency(targetProfit)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Week Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weekComparison && weekComparison.length >= 2 && (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weekComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="profit" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Target Achievement Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Target Achievement Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {targetAchievement?.map((target, index) => {
              const actual = parseFloat(target.actual_profit);
              const targetValue = parseFloat(target.target_profit);
              const variance = parseFloat(target.variance);
              const percent = targetValue > 0 ? (actual / targetValue) * 100 : 0;
              
              return (
                <div key={index} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{target.period}</span>
                    <Badge variant={variance >= 0 ? "default" : "destructive"}>
                      {variance >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {formatPercentage(percent)}
                    </Badge>
                  </div>
                  <Progress value={Math.min(percent, 100)} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(actual)} / {formatCurrency(targetValue)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Trends Tab Component
const TrendsTab = () => {
  const { data: monthlyTrends, isLoading: monthlyLoading } = useQuery({
    queryKey: ['profit-monthly-trends'],
    queryFn: () => profitApi.getMonthlyTrends(6),
  });

  const { data: weeklyTrends, isLoading: weeklyLoading } = useQuery({
    queryKey: ['profit-weekly-trends'],
    queryFn: () => profitApi.getWeeklyTrends(8),
  });

  if (monthlyLoading || weeklyLoading) {
    return <div className="space-y-6">Loading trends data...</div>;
  }

  const monthlyChartData = monthlyTrends?.map(trend => ({
    period: trend.period,
    profit: parseFloat(trend.monthly_profit),
    revenue: parseFloat(trend.monthly_revenue),
    margin: parseFloat(trend.margin)
  }));

  const weeklyChartData = weeklyTrends?.map(trend => ({
    week: trend.week_number,
    profit: parseFloat(trend.weekly_profit),
    revenue: parseFloat(trend.weekly_revenue),
    margin: parseFloat(trend.week_margin)
  }));

  return (
    <div className="space-y-6">
      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Profit Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyChartData}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'margin' ? formatPercentage(value as number) : formatCurrency(value as number),
                  name === 'profit' ? 'Profit' : name === 'revenue' ? 'Revenue' : 'Margin'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#10B981" 
                fillOpacity={1}
                fill="url(#profitGradient)"
              />
              <Line type="monotone" dataKey="margin" stroke="#F59E0B" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'margin' ? formatPercentage(value as number) : formatCurrency(value as number),
                name === 'profit' ? 'Profit' : name === 'revenue' ? 'Revenue' : 'Margin'
              ]} />
              <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={3} />
              <Line type="monotone" dataKey="margin" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = () => {
  const { data: categoryPerformance, isLoading: categoryLoading } = useQuery({
    queryKey: ['profit-category-performance'],
    queryFn: profitApi.getCategoryPerformance,
  });

  const { data: topCustomers, isLoading: customersLoading } = useQuery({
    queryKey: ['profit-top-customers'],
    queryFn: () => profitApi.getTopCustomers(10),
  });

  if (categoryLoading || customersLoading) {
    return <div className="space-y-6">Loading analytics data...</div>;
  }

  const categoryChartData = categoryPerformance?.map((category, index) => ({
    name: category.category_name,
    profit: parseFloat(category.profit),
    revenue: parseFloat(category.revenue),
    margin: parseFloat(category.margin),
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-6">
      {/* Category Performance */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Profit by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <RechartsPieChart data={categoryChartData}>
                  {categoryChartData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryPerformance?.slice(0, 5).map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <p className="font-medium">{category.category_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.sales_count} sales • {formatPercentage(category.margin)} margin
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(category.profit)}</p>
                  <p className="text-xs text-muted-foreground">profit</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top Profitable Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCustomers?.slice(0, 8).map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{customer.customer_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.monthly_orders} orders • {formatPercentage(customer.margin)} margin
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">{formatCurrency(customer.monthly_profit)}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(customer.monthly_revenue)} revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Profit() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Profit Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive profit tracking and analysis dashboard
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <OverviewCards />

      {/* Main Content Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <PerformanceTab />
        </TabsContent>

        <TabsContent value="trends">
          <TrendsTab />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Profit Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Advanced insights and recommendations coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}