import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../utils/supabaseClient";
import { Input, Form, Button } from "@heroui/react";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState(null);

  const onSubmit = async ({ email }) => {
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return setMessage(error.message);
    setMessage("Se esse email existir no sistema, enviamos um link para redefinir a senha.");
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold">Esqueci Minha Senha</h1>
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-80">
        <Input 
          {...register("email", { required: "Email é obrigatório", pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" } })} 
          placeholder="Digite seu email" 
          className="border p-2 rounded"
        />
        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

        {message && <span className="text-green-500 text-sm">{message}</span>}


        <Link to="/signin" className="text-blue-500 mt-2">Voltar</Link>
        <Button type="submit" className="bg-blue-500 text-white p-2 rounded">Enviar</Button>
      </Form>
    </div>
  );
};

export default ForgotPassword;
