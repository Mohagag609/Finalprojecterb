'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Calculator, FileText, DollarSign, History, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  code: string;
}

interface Partner {
  id: string;
  name: string;
  type: string;
}

interface ProjectPartner {
  id: string;
  partnerId: string;
  partner: Partner;
  sharePercentage: number;
  previousCarry: number;
  walletAccountId: string;
}

interface SettlementPlan {
  fromPartnerId: string;
  toPartnerId: string;
  amount: number;
}

export default function PartnerSettlementsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [projectPartners, setProjectPartners] = useState<ProjectPartner[]>([]);
  const [settlementPlan, setSettlementPlan] = useState<SettlementPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [executing, setExecuting] = useState(false);

  // Load projects
  useEffect(() => {
    fetchProjects();
  }, []);

  // Load project partners when project is selected
  useEffect(() => {
    if (selectedProject) {
      fetchProjectPartners(selectedProject);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/real-estate/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل المشاريع',
        variant: 'destructive',
      });
    }
  };

  const fetchProjectPartners = async (projectId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/real-estate/partners?projectId=${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch partners');
      const data = await response.json();
      setProjectPartners(data);
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل الشركاء',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSettlement = () => {
    setCalculating(true);
    
    // Client-side calculation of settlement plan
    const contributions = projectPartners.map(pp => ({
      partnerId: pp.partnerId,
      amount: Number(pp.previousCarry)
    }));

    const total = contributions.reduce((s, c) => s + c.amount, 0);
    const avg = total / contributions.length;
    const due = contributions.map((c) => ({ partnerId: c.partnerId, due: c.amount - avg }));
    const payers = [...due].filter((d) => d.due < 0).map((d) => ({ ...d, due: Math.abs(d.due) }));
    const receivers = [...due].filter((d) => d.due > 0);
    
    const plan: SettlementPlan[] = [];
    let i = 0, j = 0;
    
    while (i < payers.length && j < receivers.length) {
      const pay = payers[i];
      const rec = receivers[j];
      const amt = Math.min(pay.due, rec.due);
      
      if (amt > 0) {
        plan.push({ 
          fromPartnerId: pay.partnerId, 
          toPartnerId: rec.partnerId, 
          amount: Math.round(amt * 100) / 100 
        });
        pay.due -= amt;
        rec.due -= amt;
      }
      
      if (pay.due <= 0.0001) i++;
      if (rec.due <= 0.0001) j++;
    }
    
    setSettlementPlan(plan);
    setCalculating(false);
  };

  const executeSettlement = async () => {
    setExecuting(true);
    try {
      const response = await fetch('/api/settlements/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: selectedProject }),
      });

      if (!response.ok) throw new Error('Failed to execute settlement');
      
      const result = await response.json();
      
      toast({
        title: 'نجح التنفيذ',
        description: 'تمت المخالصة بنجاح',
      });

      // Reset state
      setSettlementPlan([]);
      fetchProjectPartners(selectedProject);
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل تنفيذ المخالصة',
        variant: 'destructive',
      });
    } finally {
      setExecuting(false);
    }
  };

  const getPartnerName = (partnerId: string) => {
    const partner = projectPartners.find(pp => pp.partnerId === partnerId);
    return partner?.partner.name || 'غير معروف';
  };

  const getTotalContributions = () => {
    return projectPartners.reduce((sum, pp) => sum + Number(pp.previousCarry), 0);
  };

  const printSettlementPlan = () => {
    const project = projects.find(p => p.id === selectedProject);
    if (!project || settlementPlan.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>خطة المخالصة</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            direction: rtl;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .info-section {
            margin-bottom: 30px;
          }
          .info-item {
            margin: 10px 0;
          }
          .info-label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: right;
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .partners-table {
            margin-bottom: 40px;
          }
          .settlement-table {
            margin-bottom: 40px;
          }
          .total-row {
            font-weight: bold;
            background-color: #f9f9f9;
          }
          .note {
            margin-top: 30px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
          }
          @media print {
            body {
              margin: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>خطة مخالصة الشركاء</h1>
          <h2>${project.name} (${project.code})</h2>
        </div>
        
        <div class="info-section">
          <div class="info-item">
            <span class="info-label">تاريخ الإعداد:</span>
            <span>${format(new Date(), 'dd/MM/yyyy')}</span>
          </div>
          <div class="info-item">
            <span class="info-label">إجمالي المساهمات:</span>
            <span>${getTotalContributions().toLocaleString('ar-SA')} ر.س</span>
          </div>
          <div class="info-item">
            <span class="info-label">عدد الشركاء:</span>
            <span>${projectPartners.length}</span>
          </div>
        </div>

        <h3>أرصدة الشركاء الحالية:</h3>
        <table class="partners-table">
          <thead>
            <tr>
              <th>الشريك</th>
              <th>النوع</th>
              <th>نسبة المشاركة</th>
              <th>الرصيد المرحل</th>
            </tr>
          </thead>
          <tbody>
            ${projectPartners.map(pp => `
              <tr>
                <td>${pp.partner.name}</td>
                <td>${pp.partner.type === 'COMPANY' ? 'شركة' : 'فرد'}</td>
                <td>${pp.sharePercentage}%</td>
                <td>${Number(pp.previousCarry).toLocaleString('ar-SA')} ر.س</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="3">المجموع</td>
              <td>${getTotalContributions().toLocaleString('ar-SA')} ر.س</td>
            </tr>
          </tbody>
        </table>

        <h3>خطة التحويلات المطلوبة:</h3>
        <table class="settlement-table">
          <thead>
            <tr>
              <th>من الشريك</th>
              <th>إلى الشريك</th>
              <th>المبلغ</th>
            </tr>
          </thead>
          <tbody>
            ${settlementPlan.map(plan => `
              <tr>
                <td>${getPartnerName(plan.fromPartnerId)}</td>
                <td>${getPartnerName(plan.toPartnerId)}</td>
                <td>${plan.amount.toLocaleString('ar-SA')} ر.س</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="note">
          <p><strong>ملاحظة:</strong> هذه خطة مؤقتة للمخالصة ولم يتم تنفيذها بعد. يجب الموافقة عليها وتنفيذها من خلال النظام.</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">مخالصات الشركاء</h1>
          <p className="text-muted-foreground mt-1">إدارة وتنفيذ المخالصات المالية بين الشركاء</p>
        </div>
        <Link href="/settlements/partners/history">
          <Button variant="outline">
            <History className="mr-2 h-4 w-4" />
            عرض السجل
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اختر المشروع</CardTitle>
          <CardDescription>اختر المشروع المطلوب إجراء المخالصة له</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر المشروع" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name} ({project.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedProject && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>شركاء المشروع</CardTitle>
              <CardDescription>قائمة الشركاء ومساهماتهم الحالية</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الشريك</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>نسبة المشاركة</TableHead>
                        <TableHead className="text-right">الرصيد المرحل</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectPartners.map((pp) => (
                        <TableRow key={pp.id}>
                          <TableCell className="font-medium">{pp.partner.name}</TableCell>
                          <TableCell>
                            <Badge variant={pp.partner.type === 'COMPANY' ? 'default' : 'secondary'}>
                              {pp.partner.type === 'COMPANY' ? 'شركة' : 'فرد'}
                            </Badge>
                          </TableCell>
                          <TableCell>{pp.sharePercentage}%</TableCell>
                          <TableCell className="text-right font-mono">
                            {Number(pp.previousCarry).toLocaleString('ar-SA')} ر.س
                          </TableCell>
                        </TableRow>
                      ))}
                      {projectPartners.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="font-bold">المجموع</TableCell>
                          <TableCell className="text-right font-bold font-mono">
                            {getTotalContributions().toLocaleString('ar-SA')} ر.س
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {projectPartners.length > 1 && (
                    <div className="mt-4 flex justify-end">
                      <Button 
                        onClick={calculateSettlement} 
                        disabled={calculating}
                        variant="outline"
                      >
                        {calculating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Calculator className="mr-2 h-4 w-4" />
                        )}
                        حساب المخالصة
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {settlementPlan.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>خطة المخالصة</CardTitle>
                <CardDescription>التحويلات المطلوبة لتسوية الحسابات بين الشركاء</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>من الشريك</TableHead>
                      <TableHead>إلى الشريك</TableHead>
                      <TableHead className="text-right">المبلغ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settlementPlan.map((plan, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {getPartnerName(plan.fromPartnerId)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {getPartnerName(plan.toPartnerId)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {plan.amount.toLocaleString('ar-SA')} ر.س
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setSettlementPlan([])}
                  >
                    إلغاء
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={printSettlementPlan}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    طباعة الخطة
                  </Button>
                  <Button 
                    onClick={executeSettlement} 
                    disabled={executing}
                  >
                    {executing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <DollarSign className="mr-2 h-4 w-4" />
                    )}
                    تنفيذ المخالصة
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}