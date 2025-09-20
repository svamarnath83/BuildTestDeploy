'use client';

import { Login } from '@commercialapp/ui';
import type { LoginFormValues } from '@commercialapp/ui';
import { useRouter } from 'next/navigation';
import { createUserSession } from '@commercialapp/ui';
import { authService } from '@commercialapp/ui';
import { tokenManager } from '@commercialapp/ui';
import { useCacheStore } from '@commercialapp/ui';

export default function LoginPage() {
	const router = useRouter();

	const onSubmit = async (data: LoginFormValues) => {
		// Call real login API
		const res = await authService.login(data);
		console.log('Full login response:', res);
		console.log('User object:', res.user);
		console.log('Username:', res.user.Name);
		
		// Store long token and user info
		tokenManager.setTokenData({
			longToken: res.longToken,
			username: res.user.Name
		});

		// Clear any legacy cache and create new user session
		useCacheStore.getState().clearAllSessions();
		createUserSession(res.user.Name);
		
		// Redirect to estimates page
		router.push(`/estimates`);
	};

	return <Login appName="Chartering" onSubmit={onSubmit} />;
}
