'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Eye, FileText, Calendar, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SettlementHistory {
  id: string;
  date: string;
  projectId: string;
  project: {
    name: string;
    code: string;
  };
  description: string;
  totalAmount: number;
  lines: {
    accountId: string;
    account: {
      name: string;
    };
    debit: number;
    credit: number;
    partnerId?: string;
    partner?: {
      name: string;
    };
  }[];
  createdBy: string;
  creator: {
    name: string;
  };
}

interface Project {
  id: string;
  name: string;
  code: string;
}

export default function PartnerSettlementHistoryPage() {
  const [settlements, setSettlements] = useState<SettlementHistory[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<SettlementHistory | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchSettlements();
  }, []);

  useEffect(() => {
    fetchSettlements();
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/real-estate/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchSettlements = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedProject !== 'all') {
        params.append('projectId', selectedProject);
      }
      params.append('type', 'settlement');

      const response = await fetch(`/api/accounting/journal?${params}`);
      if (!response.ok) throw new Error('Failed to fetch settlements');
      
      const data = await response.json();
      
      // Filter for partner settlements
      const partnerSettlements = data.items.filter((entry: any) => 
        entry.description.includes('Partner settlement')
      );
      
      setSettlements(partnerSettlements);
    } catch (error) {
      console.error('Error fetching settlements:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = (lines: any[]) => {
    return lines.reduce((sum, line) => sum + (line.debit || 0), 0);
  };

  const viewDetails = (settlement: SettlementHistory) => {
    setSelectedSettlement(settlement);
    setDetailsOpen(true);
  };

  const printSettlement = () => {
    if (!selectedSettlement) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>تقرير المخالصة</title>
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
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 30px;
          }
          .info-item {
            padding: 5px;
          }
          .info-label {
            font-weight: bold;
            display: inline-block;
            width: 100px;
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
          .total-row {
            font-weight: bold;
            background-color: #f9f9f9;
          }
          .footer {
            margin-top: 50px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 100px;
          }
          .signature-box {
            text-align: center;
            border-top: 1px solid #333;
            padding-top: 10px;
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
          <h1>تقرير مخالصة الشركاء</h1>
          <h2>${selectedSettlement.project?.name || 'غير محدد'}</h2>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">رقم القيد:</span>
            <span>${selectedSettlement.id}</span>
          </div>
          <div class="info-item">
            <span class="info-label">التاريخ:</span>
            <span>${format(new Date(selectedSettlement.date), 'dd/MM/yyyy')}</span>
          </div>
          <div class="info-item">
            <span class="info-label">المشروع:</span>
            <span>${selectedSettlement.project?.name} (${selectedSettlement.project?.code})</span>
          </div>
          <div class="info-item">
            <span class="info-label">المنفذ:</span>
            <span>${selectedSettlement.creator?.name || 'النظام'}</span>
          </div>
        </div>

        <h3>تفاصيل الحركات المالية:</h3>
        <table>
          <thead>
            <tr>
              <th>الحساب</th>
              <th>الشريك</th>
              <th>مدين</th>
              <th>دائن</th>
            </tr>
          </thead>
          <tbody>
            ${selectedSettlement.lines.map(line => `
              <tr>
                <td>${line.account?.name || ''}</td>
                <td>${line.partner?.name || '-'}</td>
                <td>${line.debit ? line.debit.toLocaleString('ar-SA') + ' ر.س' : '-'}</td>
                <td>${line.credit ? line.credit.toLocaleString('ar-SA') + ' ر.س' : '-'}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="2">المجموع</td>
              <td>${selectedSettlement.lines.reduce((sum, line) => sum + (line.debit || 0), 0).toLocaleString('ar-SA')} ر.س</td>
              <td>${selectedSettlement.lines.reduce((sum, line) => sum + (line.credit || 0), 0).toLocaleString('ar-SA')} ر.س</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <div class="signature-box">
            <p>توقيع المحاسب</p>
          </div>
          <div class="signature-box">
            <p>توقيع المدير المالي</p>
          </div>
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
          <h1 className="text-3xl font-bold">تاريخ مخالصات الشركاء</h1>
          <p className="text-muted-foreground mt-1">عرض سجل المخالصات السابقة بين الشركاء</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>فلترة النتائج</CardTitle>
          <CardDescription>اختر المشروع لعرض مخالصاته</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر المشروع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المشاريع</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name} ({project.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>سجل المخالصات</CardTitle>
          <CardDescription>قائمة بجميع المخالصات المنفذة</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : settlements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد مخالصات مسجلة
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>المشروع</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead className="text-right">المبلغ الإجمالي</TableHead>
                  <TableHead>المنفذ</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settlements.map((settlement) => (
                  <TableRow key={settlement.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(settlement.date), 'dd MMMM yyyy', { locale: ar })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {settlement.project?.name || 'غير محدد'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {settlement.description}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {calculateTotalAmount(settlement.lines).toLocaleString('ar-SA')} ر.س
                    </TableCell>
                    <TableCell>
                      {settlement.creator?.name || 'النظام'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => viewDetails(settlement)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle>تفاصيل المخالصة</DialogTitle>
                <DialogDescription>
                  {selectedSettlement && (
                    <span>
                      {format(new Date(selectedSettlement.date), 'dd MMMM yyyy', { locale: ar })} - 
                      {' '}{selectedSettlement.project?.name}
                    </span>
                  )}
                </DialogDescription>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={printSettlement}
              >
                <Printer className="h-4 w-4 mr-2" />
                طباعة
              </Button>
            </div>
          </DialogHeader>
          
          {selectedSettlement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">المشروع:</span>{' '}
                  {selectedSettlement.project?.name}
                </div>
                <div>
                  <span className="font-medium">التاريخ:</span>{' '}
                  {format(new Date(selectedSettlement.date), 'dd/MM/yyyy')}
                </div>
                <div>
                  <span className="font-medium">المنفذ:</span>{' '}
                  {selectedSettlement.creator?.name || 'النظام'}
                </div>
                <div>
                  <span className="font-medium">رقم القيد:</span>{' '}
                  {selectedSettlement.id}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">تفاصيل الحركات:</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الحساب</TableHead>
                      <TableHead>الشريك</TableHead>
                      <TableHead className="text-right">مدين</TableHead>
                      <TableHead className="text-right">دائن</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSettlement.lines.map((line, index) => (
                      <TableRow key={index}>
                        <TableCell>{line.account?.name}</TableCell>
                        <TableCell>{line.partner?.name || '-'}</TableCell>
                        <TableCell className="text-right font-mono">
                          {line.debit ? `${line.debit.toLocaleString('ar-SA')} ر.س` : '-'}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {line.credit ? `${line.credit.toLocaleString('ar-SA')} ر.س` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold">
                      <TableCell colSpan={2}>المجموع</TableCell>
                      <TableCell className="text-right font-mono">
                        {selectedSettlement.lines
                          .reduce((sum, line) => sum + (line.debit || 0), 0)
                          .toLocaleString('ar-SA')} ر.س
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {selectedSettlement.lines
                          .reduce((sum, line) => sum + (line.credit || 0), 0)
                          .toLocaleString('ar-SA')} ر.س
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}