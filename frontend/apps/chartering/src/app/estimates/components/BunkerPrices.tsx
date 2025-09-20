'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@commercialapp/ui';
import { Button } from '@commercialapp/ui';
import { Input } from '@commercialapp/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@commercialapp/ui';
import { Badge } from '@commercialapp/ui';
import { getlatestBunkerPrice } from '../../cargo-analysis/libs/estimate-api-services';

interface BunkerPrice {
  PortId: string;
  PortName: string;
  CountryName: string;
  PortRank: number;
  FuelGradeId: string;
  FuelGradeDescription: string;
  PublishedDate: string;
  Price: number;
}

interface BunkerPricesProps {
  className?: string;
}

const BunkerPrices: React.FC<BunkerPricesProps> = ({ className = '' }) => {
  const [bunkerPrices, setBunkerPrices] = useState<BunkerPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<keyof BunkerPrice>('PublishedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Fetch bunker prices on component mount
  useEffect(() => {
    fetchBunkerPrices();
  }, []);

  const fetchBunkerPrices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getlatestBunkerPrice();
      setBunkerPrices(response.data || []);
    } catch (err) {
      setError('Failed to fetch bunker prices. Please try again later.');
      console.error('Error fetching bunker prices:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const uniqueGrades = useMemo(() => {
    const grades = [...new Set(bunkerPrices.map(bp => bp.FuelGradeId))];
    return grades.sort();
  }, [bunkerPrices]);

  const uniqueCountries = useMemo(() => {
    const countries = [...new Set(bunkerPrices.map(bp => bp.CountryName))];
    return countries.sort();
  }, [bunkerPrices]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    const filtered = bunkerPrices.filter(bp => {
      const matchesSearch = bp.PortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bp.CountryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bp.FuelGradeDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = selectedGrade === 'all' || bp.FuelGradeId === selectedGrade;
      const matchesCountry = selectedCountry === 'all' || bp.CountryName === selectedCountry;
      
      return matchesSearch && matchesGrade && matchesCountry;
    });

    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [bunkerPrices, searchTerm, selectedGrade, selectedCountry, sortBy, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredAndSortedData.length === 0) return null;

    const prices = filteredAndSortedData.map(bp => bp.Price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    return { minPrice, maxPrice, avgPrice, totalPorts: filteredAndSortedData.length };
  }, [filteredAndSortedData]);

  const handleSort = (field: keyof BunkerPrice) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriceColor = (price: number) => {
    if (price < 500) return 'bg-green-100 text-green-800 border-green-200';
    if (price < 800) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getGradeColor = (gradeId: string) => {
    const colors: Record<string, string> = {
      'hfo': 'bg-blue-100 text-blue-800 border-blue-200',
      'lsfo': 'bg-purple-100 text-purple-800 border-purple-200',
      'mgo': 'bg-green-100 text-green-800 border-green-200',
      'vlsfo': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[gradeId.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading bunker prices...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-red-600 mb-4">⚠️ {error}</div>
            <Button onClick={fetchBunkerPrices} className="bg-blue-600 hover:bg-blue-700">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                🛢️ Bunker Prices
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Latest bunker fuel prices by port and grade
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={fetchBunkerPrices}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                🔄 Refresh
              </Button>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                {bunkerPrices.length} Prices
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalPorts}</div>
                <div className="text-sm text-gray-600">Total Ports</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatPrice(stats.minPrice)}</div>
                <div className="text-sm text-gray-600">Lowest Price</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{formatPrice(stats.avgPrice)}</div>
                <div className="text-sm text-gray-600">Average Price</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{formatPrice(stats.maxPrice)}</div>
                <div className="text-sm text-gray-600">Highest Price</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Ports/Countries
              </label>
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Grade
              </label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {uniqueGrades.map(grade => (
                    <SelectItem key={grade} value={grade}>
                      {grade.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {uniqueCountries.map(country => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGrade('all');
                  setSelectedCountry('all');
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('PortName')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Port</span>
                      {sortBy === 'PortName' && (
                        <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('CountryName')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Country</span>
                      {sortBy === 'CountryName' && (
                        <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('FuelGradeId')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Grade</span>
                      {sortBy === 'FuelGradeId' && (
                        <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('Price')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Price (USD/MT)</span>
                      {sortBy === 'Price' && (
                        <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('PublishedDate')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Published</span>
                      {sortBy === 'PublishedDate' && (
                        <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Port Rank
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No bunker prices found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedData.map((bunkerPrice, index) => (
                    <tr key={`${bunkerPrice.PortId}-${bunkerPrice.FuelGradeId}`} 
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">{bunkerPrice.PortName}</div>
                          <div className="text-sm text-gray-500">{bunkerPrice.PortId}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-900">{bunkerPrice.CountryName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getGradeColor(bunkerPrice.FuelGradeId)}>
                          {bunkerPrice.FuelGradeId.toUpperCase()}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {bunkerPrice.FuelGradeDescription}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getPriceColor(bunkerPrice.Price)}>
                          {formatPrice(bunkerPrice.Price)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900">
                          {formatDate(bunkerPrice.PublishedDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                          #{bunkerPrice.PortRank}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-sm text-gray-600">
            Showing {filteredAndSortedData.length} of {bunkerPrices.length} bunker prices
            {searchTerm && ` • Filtered by "${searchTerm}"`}
            {selectedGrade !== 'all' && ` • Grade: ${selectedGrade.toUpperCase()}`}
            {selectedCountry !== 'all' && ` • Country: ${selectedCountry}`}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BunkerPrices; 