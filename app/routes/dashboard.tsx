import { Table, Tabs, TextInput, Button, Modal, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard - Stock Brokers" },
    { name: "description", content: "Stock brokers dashboard overview" },
  ];
};

interface AssetData {
  name: string;
  value: number;
  percentage: number;
}

const DEFAULT_BROKERS: AssetData[] = [
  { name: 'Tiger Broker', value: 0, percentage: 0 },
  { name: 'Moomoo', value: 0, percentage: 0 },
  { name: 'WeBull', value: 0, percentage: 0 },
  { name: 'Interactive Brokers', value: 0, percentage: 0 },
];

const DEFAULT_CRYPTO: AssetData[] = [
  { name: 'Coinbase', value: 0, percentage: 0 },
  { name: 'OKX', value: 0, percentage: 0 },
  { name: 'Coinbase Wallet', value: 0, percentage: 0 },
];

const DEFAULT_CASH: AssetData[] = [
  { name: 'DBS', value: 0, percentage: 0 },
  { name: 'GXS', value: 0, percentage: 0 },
  { name: 'MariBank', value: 0, percentage: 0 },
];

export default function Dashboard() {
  const [stocksData, setStocksData] = useState<AssetData[]>([]);
  const [cryptoData, setCryptoData] = useState<AssetData[]>([]);
  const [cashData, setCashData] = useState<AssetData[]>([]);

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedStocks = localStorage.getItem('stocks');
    const savedCrypto = localStorage.getItem('crypto');
    const savedCash = localStorage.getItem('cash');

    setStocksData(savedStocks ? JSON.parse(savedStocks) : DEFAULT_BROKERS);
    setCryptoData(savedCrypto ? JSON.parse(savedCrypto) : DEFAULT_CRYPTO);
    setCashData(savedCash ? JSON.parse(savedCash) : DEFAULT_CASH);
  }, []);

  const handleDataUpdate = (category: string, newData: AssetData[]) => {
    switch (category) {
      case 'stocks':
        setStocksData(newData);
        localStorage.setItem('stocks', JSON.stringify(newData));
        break;
      case 'crypto':
        setCryptoData(newData);
        localStorage.setItem('crypto', JSON.stringify(newData));
        break;
      case 'cash':
        setCashData(newData);
        localStorage.setItem('cash', JSON.stringify(newData));
        break;
    }
  };

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-6">Portfolio</h1>
      
      <Tabs defaultValue="stocks" className="mb-4">
        <Tabs.List>
          <Tabs.Tab value="stocks">Stocks</Tabs.Tab>
          <Tabs.Tab value="crypto">Crypto</Tabs.Tab>
          <Tabs.Tab value="cash">Cash</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="stocks">
          <AssetTable 
            data={stocksData} 
            onUpdate={(data) => handleDataUpdate('stocks', data)} 
            category="stocks"
          />
        </Tabs.Panel>

        <Tabs.Panel value="crypto">
          <AssetTable 
            data={cryptoData} 
            onUpdate={(data) => handleDataUpdate('crypto', data)} 
            category="crypto"
          />
        </Tabs.Panel>

        <Tabs.Panel value="cash">
          <AssetTable 
            data={cashData} 
            onUpdate={(data) => handleDataUpdate('cash', data)} 
            category="cash"
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

function AssetTable({ 
  data, 
  onUpdate,
  category 
}: { 
  data: AssetData[], 
  onUpdate: (data: AssetData[]) => void,
  category: 'stocks' | 'crypto' | 'cash'
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');

  const handleAddItem = () => {
    if (newItemName.trim()) {
      const newData = [
        ...data,
        { name: newItemName.trim(), value: 0, percentage: 0 }
      ];
      onUpdate(newData);
      setNewItemName('');
      setIsModalOpen(false);
    }
  };

  const totalValue = data.reduce((sum, item) => {
    const value = Number(item.value) || 0;
    return sum + value;
  }, 0);

  const handleValueChange = (index: number, newValue: string) => {
    const updatedData = data.map((item, i) => {
      if (i === index) {
        const value = parseFloat(newValue);
        return { ...item, value: isNaN(value) ? 0 : value };
      }
      return item;
    });

    onUpdate(updatedData);
  };

  const dataWithPercentages = data.map(item => ({
    ...item,
    percentage: totalValue === 0 ? 0 : 
      ((Number(item.value) || 0) / totalValue * 100).toFixed(1)
  }));

  return (
    <>
      <Table 
        highlightOnHover 
        className="bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <Table.Thead>
          <Table.Tr className="border-b border-gray-200">
            <Table.Th className="bg-gray-50 text-gray-700 font-semibold px-6 py-4 w-1/3">Name</Table.Th>
            <Table.Th className="bg-gray-50 text-gray-700 font-semibold px-6 py-4 w-1/3">Value</Table.Th>
            <Table.Th className="bg-gray-50 text-gray-700 font-semibold px-6 py-4 w-1/3">Proportion (%)</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {dataWithPercentages.map((item, index) => (
            <Table.Tr 
              key={item.name}
              className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
            >
              <Table.Td className="px-6 py-4 border-b border-gray-200">{item.name}</Table.Td>
              <Table.Td className="px-6 py-4 border-b border-gray-200">
                <TextInput
                  value={item.value.toString()}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  placeholder="Enter value"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </Table.Td>
              <Table.Td className="px-6 py-4 border-b border-gray-200 text-gray-600">{item.percentage}%</Table.Td>
            </Table.Tr>
          ))}
          <Table.Tr className="bg-gray-50 font-semibold">
            <Table.Td className="px-6 py-4 border-t border-gray-200">Total</Table.Td>
            <Table.Td className="px-6 py-4 border-t border-gray-200 text-gray-900">
              ${(totalValue || 0).toFixed(2)}
            </Table.Td>
            <Table.Td className="px-6 py-4 border-t border-gray-200">100%</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td colSpan={3} className="px-6 py-4 border-t border-gray-200">
              <Button 
                variant="light" 
                onClick={() => setIsModalOpen(true)}
                className="w-full"
              >
                Add New {category === 'stocks' ? 'Broker' : category === 'crypto' ? 'Wallet' : 'Bank'}
              </Button>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Add New ${category === 'stocks' ? 'Broker' : category === 'crypto' ? 'Wallet' : 'Bank'}`}
      >
        <div className="space-y-4">
          <TextInput
            label="Name"
            placeholder="Enter name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddItem}>Add</Button>
          </Group>
        </div>
      </Modal>
    </>
  );
} 