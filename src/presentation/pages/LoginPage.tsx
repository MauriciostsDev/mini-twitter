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
    <div className="flex min-h-screen items-center justify-center bg-[#0B1120] text-white p-4 font-sans">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-10">Mini Twitter</h1>

        <div className="flex border-b border-gray-800 mb-8 mt-2">
          <Link to="/login" className="flex-1 pb-3 text-center font-semibold text-white border-b-[3px] border-blue-500">
            Login
          </Link>
          <Link to="/register" className="flex-1 pb-3 text-center font-semibold text-gray-500 hover:text-gray-300 border-b-[3px] border-transparent transition-colors">
            Cadastrar
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-[28px] leading-tight font-bold mb-1.5 tracking-tight">Olá, de novo!</h2>
          <p className="text-gray-400 text-[15px]">Por favor, insira os seus dados para fazer login.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-[13px] text-gray-300 mb-2">
              E-mail
            </label>
            <div className="relative">
              <input
                type="email"
                {...register('email')}
                className="w-full pl-4 pr-10 py-3 bg-[#1E293B] border border-gray-700/50 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white placeholder-gray-500"
                placeholder="Insira o seu e-mail"
              />
              <Mail className="absolute right-3.5 top-3.5 text-gray-500" size={18} strokeWidth={2} />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-[13px] text-gray-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register('password')}
                className="w-full pl-4 pr-10 py-3 bg-[#1E293B] border border-gray-700/50 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white placeholder-gray-500"
                placeholder="Insira a sua senha"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <Eye size={18} strokeWidth={2} /> : <EyeOff size={18} strokeWidth={2} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
          </div>

          {loginError && (
             <p className="text-red-400 text-[13px] text-center font-medium bg-red-900/20 py-2 rounded-lg border border-red-900/40">
               Credenciais inválidas.
             </p>
          )}

          <button
            type="submit"
            disabled={!isValid || isLoggingIn}
            className="w-full bg-[#0ea5e9] hover:bg-blue-500 active:bg-blue-600 text-white font-semibold py-3 px-4 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-[0_0_20px_rgba(14,165,233,0.2)] hover:shadow-[0_0_25px_rgba(14,165,233,0.3)]"
          >
            {isLoggingIn ? 'Continuando...' : 'Continuar'}
          </button>
        </form>

        <p className="text-center mt-8 text-[11px] text-gray-500 max-w-[280px] mx-auto leading-relaxed">
          Ao clicar em continuar, você concorda com nossos <br/>
          <a href="#" className="underline hover:text-gray-300 transition-colors">Termos de Serviço</a> e <a href="#" className="underline hover:text-gray-300 transition-colors">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  );
}
