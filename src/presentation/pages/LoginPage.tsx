import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../../domain/schemas/authSchema';
import { useAuthViewModel } from '../viewmodels/useAuthViewModel';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { Mail, EyeOff, Eye } from 'lucide-react';
import { useState } from 'react';

export function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuthViewModel();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (err) {
       console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-page)] text-[var(--text-main)] p-4 font-sans transition-colors">
      <div className="w-full max-w-[480px]">
        <h1 className="text-3xl font-bold text-center mb-10 text-[var(--color-brand)] transition-colors">Mini Twitter</h1>

        <div className="flex border-b border-[var(--border-ui)] mb-8 mt-2 transition-colors">
          <Link to="/login" className="flex-1 pb-3 text-center font-semibold text-[var(--text-main)] border-b-[3px] border-blue-500">
            Login
          </Link>
          <Link to="/register" className="flex-1 pb-3 text-center font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] border-b-[3px] border-transparent transition-colors">
            Cadastrar
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-[28px] leading-tight font-bold mb-1.5 tracking-tight text-[var(--color-brand)] dark:text-[var(--text-main)]">Olá, de novo!</h2>
          <p className="text-[var(--text-muted)] text-[15px]">Por favor, insira os seus dados para fazer login.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-[13px] text-[var(--text-muted)] mb-2 font-medium">
              E-mail
            </label>
            <div className="relative">
              <input
                type="email"
                {...register('email')}
                className="w-full pl-4 pr-10 py-3 bg-[var(--bg-input)] border border-[var(--border-ui)] rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all text-[var(--text-main)] placeholder-[var(--text-muted)]"
                placeholder="Insira o seu e-mail"
              />
              <Mail className="absolute right-3.5 top-3.5 text-[var(--color-brand)] transition-colors" size={18} strokeWidth={2} />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-[13px] text-[var(--text-muted)] mb-2 font-medium">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                className="w-full pl-4 pr-10 py-3 bg-[var(--bg-input)] border border-[var(--border-ui)] rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all text-[var(--text-main)] placeholder-[var(--text-muted)]"
                placeholder="Insira a sua senha"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[var(--color-brand)] hover:text-blue-500 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <Eye size={18} strokeWidth={2} /> : <EyeOff size={18} strokeWidth={2} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
          </div>

          {loginError && (
             <p className="text-red-500 text-[13px] text-center font-medium bg-red-500/10 py-2.5 rounded-lg border border-red-500/20 px-2">
               {(loginError as any)?.response?.data?.error || "Credenciais inválidas."}
             </p>
          )}

          <button
            type="submit"
            disabled={!isValid || isLoggingIn}
            className="w-full bg-[#0D93F2] hover:bg-blue-500 active:bg-blue-600 text-white font-semibold py-3 px-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            {isLoggingIn ? 'Continuando...' : 'Continuar'}
          </button>
        </form>

        <p className="text-center mt-8 text-[11px] text-[var(--text-muted)] max-w-[280px] mx-auto leading-relaxed">
          Ao clicar em continuar, você concorda com nossos <br/>
          <a href="#" className="underline hover:text-[var(--text-main)] transition-colors">Termos de Serviço</a> e <a href="#" className="underline hover:text-[var(--text-main)] transition-colors">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  );
}
