import { PrismaClient, Role, AccountType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@demo.local';
  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: 'Admin', passwordHash, role: Role.ADMIN }
  });

  // Basic Chart of Accounts
  const assets = await prisma.account.upsert({
    where: { code: '1000' },
    update: {},
    create: { code: '1000', name: 'الأصول', type: AccountType.asset }
  });
  const cash = await prisma.account.upsert({
    where: { code: '1100' },
    update: {},
    create: { code: '1100', name: 'الصندوق', type: AccountType.asset, parentAccountId: assets.id }
  });
  const bank = await prisma.account.upsert({
    where: { code: '1200' },
    update: {},
    create: { code: '1200', name: 'البنك', type: AccountType.asset, parentAccountId: assets.id }
  });
  const ar = await prisma.account.upsert({
    where: { code: '1300' },
    update: {},
    create: { code: '1300', name: 'الذمم المدينة', type: AccountType.asset, parentAccountId: assets.id }
  });

  const liabilities = await prisma.account.upsert({
    where: { code: '2000' },
    update: {},
    create: { code: '2000', name: 'الخصوم', type: AccountType.liability }
  });
  const ap = await prisma.account.upsert({
    where: { code: '2300' },
    update: {},
    create: { code: '2300', name: 'الذمم الدائنة', type: AccountType.liability, parentAccountId: liabilities.id }
  });

  const equity = await prisma.account.upsert({
    where: { code: '3000' },
    update: {},
    create: { code: '3000', name: 'حقوق الملكية', type: AccountType.equity }
  });

  const revenue = await prisma.account.upsert({
    where: { code: '4000' },
    update: {},
    create: { code: '4000', name: 'الإيرادات', type: AccountType.revenue }
  });

  const expenses = await prisma.account.upsert({
    where: { code: '5000' },
    update: {},
    create: { code: '5000', name: 'المصروفات', type: AccountType.expense }
  });

  // Project and Cashbox
  const project = await prisma.project.upsert({
    where: { code: 'PRJ-001' },
    update: {},
    create: {
      code: 'PRJ-001',
      name: 'مشروع 1',
      status: 'active',
      startDate: new Date(),
      budget: 1000000
    }
  });

  const cashbox = await prisma.cashbox.upsert({
    where: { code: 'CASH-MAIN' },
    update: {},
    create: { code: 'CASH-MAIN', name: 'خزنة رئيسية', projectId: project.id, accountId: cash.id }
  });

  // Parties
  const client = await prisma.client.create({ data: { name: 'عميل تجريبي' } });
  const supplier = await prisma.supplier.create({ data: { name: 'مورد تجريبي' } });
  const contractor = await prisma.contractor.create({ data: { name: 'مقاول تجريبي' } });
  const partnerA = await prisma.partner.create({ data: { name: 'شريك 1' } });
  const partnerB = await prisma.partner.create({ data: { name: 'شريك 2' } });

  // Partner wallets
  const walletA = await prisma.account.create({
    data: { code: '1801', name: 'محفظة شريك 1', type: AccountType.liability }
  });
  const walletB = await prisma.account.create({
    data: { code: '1802', name: 'محفظة شريك 2', type: AccountType.liability }
  });

  await prisma.projectPartner.createMany({
    data: [
      { projectId: project.id, partnerId: partnerA.id, sharePct: 50, walletAccountId: walletA.id },
      { projectId: project.id, partnerId: partnerB.id, sharePct: 50, walletAccountId: walletB.id }
    ],
    skipDuplicates: true
  });

  // Sample unit and contract
  const unit = await prisma.unit.create({
    data: {
      code: 'U-100',
      projectId: project.id,
      type: 'سكني',
      area: 120,
      price: 500000,
      status: 'available'
    }
  });

  const contract = await prisma.contract.create({
    data: {
      clientId: client.id,
      unitId: unit.id,
      startDate: new Date(),
      totalAmount: 500000,
      downPayment: 100000,
      months: 12,
      planType: 'MONTHLY'
    }
  });

  // A couple of installments
  const monthly = Number(contract.totalAmount) / contract.months;
  for (let i = 1; i <= contract.months; i++) {
    await prisma.installment.create({
      data: {
        contractId: contract.id,
        amount: Math.round(monthly * 100) / 100,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + i))
      }
    });
  }

  console.log('Seed complete. Admin:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });