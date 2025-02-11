import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../utils/supabaseClient";
import { Input, Button, Card, CardBody } from "@heroui/react";

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
    <div className="font-centuryGothic flex items-center justify-center min-h-screen bg-my-bg bg-no-repeat bg-cover">
  <Card className="p-8 rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg w-80 md:w-[480px] xl:w-[849px] flex items-center justify-center">
    <h1 className="text-center text-3xl font-bold text-white mb-6">Esqueci Minha Senha</h1> 
    <CardBody className="bg-transparent xl:w-96 rounded-2xl flex flex-col items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-xs md:max-w-md lg:max-w-lg">
        <Input 
          {...register("email", { required: "Email é obrigatório", pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" } })} 
          placeholder="Digite seu email" 
          className="p-2  mb-4 w-full"
          variant="flat"
        />
        {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}

        {message && <span className="text-white text-sm">{message}</span>}
        
        <Link to="/signin" className="text-white text-sm underline mt-6 self-start">Voltar</Link>
        <Button type="submit" className="bg-[#FFDFFF] text-[#008171] px-6 py-2 rounded-xl mt-4 w-full">Enviar</Button>
      </form>
    </CardBody>
  </Card>
</div>

  );
};

export default ForgotPassword;
