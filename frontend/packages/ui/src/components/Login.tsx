'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoginResponse } from '@commercialapp/ui';

// Login form validation schema
const loginSchema = z.object({
	username: z.string().min(1, 'Username is required'),
	password: z.string().min(1, 'Password is required'),
	accountCode: z.string().min(1, 'Account code is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;


interface LoginProps {
	onSubmit: (data: LoginFormValues) => Promise<void> | void;
	appName?: string;
}

export default function Login({ onSubmit, appName = 'Chartering' }: LoginProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	});

	const handleFormSubmit = async (data: LoginFormValues) => {
		setIsLoading(true);
		setError(null);
		try {
			await onSubmit(data);
		} catch (err: any) {
			console.error('Login submit error:', err);
			setError(err?.message || 'Login failed. Please check your credentials.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
						<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
						</svg>
					</div>
					<h1 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
						Welcome to {appName}
					</h1>
					<p className="text-gray-600 text-sm">Sign in to your account to continue</p>
				</div>

				{/* Login Form */}
				<div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
					{/* Error Display */}
					{error && (
						<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
							<p className="text-red-600 text-sm flex items-center">
								<svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								{error}
							</p>
						</div>
					)}

					<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
						{/* Username Field */}
						<div className="space-y-2">
							<label htmlFor="username" className="block text-sm font-semibold text-gray-700">
								Username
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								</div>
								<input
									id="username"
									type="text"
									placeholder="Enter your username"
									{...register('username')}
									className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
										errors.username ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
									}`}
								/>
							</div>
							{errors.username && (
								<p className="text-sm text-red-600 flex items-center">
									<svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
									</svg>
									{errors.username.message}
								</p>
							)}
						</div>

						{/* Password Field */}
						<div className="space-y-2">
							<label htmlFor="password" className="block text-sm font-semibold text-gray-700">
								Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
									</svg>
								</div>
								<input
									id="password"
									type="password"
									placeholder="Enter your password"
									{...register('password')}
									className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
										errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
									}`}
								/>
							</div>
							{errors.password && (
								<p className="text-sm text-red-600 flex items-center">
									<svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
									</svg>
									{errors.password.message}
								</p>
							)}
						</div>

						{/* Account Code Field */}
						<div className="space-y-2">
							<label htmlFor="accountCode" className="block text-sm font-semibold text-gray-700">
								Account Code
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
									</svg>
								</div>
								<input
									id="accountCode"
									type="text"
									placeholder="Enter your account code"
									{...register('accountCode')}
									className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
										errors.accountCode ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400'
									}`}
								/>
							</div>
							{errors.accountCode && (
								<p className="text-sm text-red-600 flex items-center">
									<svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
									</svg>
									{errors.accountCode.message}
								</p>
							)}
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							{isLoading ? (
								<div className="flex items-center justify-center">
									<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Signing in...
								</div>
							) : (
								'Sign In'
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
