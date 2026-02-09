'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield, BarChart3, Activity, Trophy } from 'lucide-react';

const user = {
  name: 'Perminus Gaita',
  username: '@perminus',
  avatar: 'PG',
  joined: 'January 2025',
  authMethod: 'Telegram',
  status: 'Active',
  strategiesCreated: 6,
  strategiesRun: 42,
  averageAccuracy: 71.4,
  bestAccuracy: 82.3,
  worstAccuracy: 55.1,
};

export default function ProfilePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and view your activity
        </p>
      </div>

      <Tabs defaultValue="simple" className="w-full">
        <TabsList>
          <TabsTrigger value="simple">Simple Profile</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Profile</TabsTrigger>
        </TabsList>

        {/* SIMPLE PROFILE */}
        <TabsContent value="simple" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                {user.avatar}
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.username}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Strategies Created</p>
                <p className="text-2xl font-semibold">{user.strategiesCreated}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Strategies Run</p>
                <p className="text-2xl font-semibold">{user.strategiesRun}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                <p className="text-2xl font-semibold">{user.averageAccuracy}%</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Auth Method:</span> {user.authMethod}</p>
              <p><span className="text-muted-foreground">Member Since:</span> {user.joined}</p>
              <p><span className="text-muted-foreground">Status:</span> {user.status}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ADVANCED PROFILE */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Runs</p>
                <p className="text-2xl font-semibold">{user.strategiesRun}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Best Accuracy</p>
                <p className="text-2xl font-semibold">{user.bestAccuracy}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Worst Accuracy</p>
                <p className="text-2xl font-semibold">{user.worstAccuracy}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Strategies</p>
                <p className="text-2xl font-semibold">{user.strategiesCreated}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>• Ran strategy “Safe Home Favorites”</p>
              <p>• Created strategy “High Odds Draws”</p>
              <p>• Ran strategy “Away Value Picks”</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Strategy Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Performance analytics and charts will appear here once real data
              and backtesting history are connected.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              Best performing strategy hit <strong>{user.bestAccuracy}%</strong> accuracy over multiple runs.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
