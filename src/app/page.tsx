"use client";

import { useState, useEffect } from "react";

type Tarefa = {
  id: number;
  titulo: string;
  concluida: boolean;
};

export default function Home() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novaTarefa, setNovaTarefa] = useState("");
  const [filtro, setFiltro] = useState<"todas" | "pendentes" | "feitas">("todas");
  const [carregado, setCarregado] = useState(false);


  useEffect(() => {
    try {
      const tarefasSalvas = localStorage.getItem("tarefas");
      if (tarefasSalvas) {
        setTarefas(JSON.parse(tarefasSalvas));
      }
    } catch (erro) {
      console.error("Não foi possivel carregar as tarefas pois ocorreu um erro: ", erro);
    } finally {
      setCarregado(true);
    }
  }, []);

  useEffect(() => {
    if (carregado) {
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
    }
  }, [tarefas, carregado]);
  function adicionarTarefa() {
    if (!novaTarefa.trim()) return;
    const tarefa: Tarefa = {
      id: Date.now(),
      titulo: novaTarefa.trim(),
      concluida: false,
    };
    setTarefas((tarefasAtuais) => [...tarefasAtuais, tarefa]);
    setNovaTarefa("");
  }


  function concluirTarefa(id: number) {
    setTarefas((tarefasAtuais) =>
      tarefasAtuais.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  }

  function excluirTarefa(id: number) {
    setTarefas((tarefasAtuais) =>
      tarefasAtuais.filter((tarefa) => tarefa.id !== id)
    );
  }

  const tarefasFiltradas = tarefas.filter((tarefa) => {
    if (filtro === "pendentes") return !tarefa.concluida;
    if (filtro === "feitas") return tarefa.concluida;
    return true;
  });

  return (
    <main className="flex flex-col justify-center items-center bg-[url('/wpp.webp')] bg-cover bg-center bg-no-repeat bg-fixed w-full min-h-screen py-10 px-4">
      <div className="flex flex-col bg-[#fdfdfdc5] w-full max-w-250 min-h-165 h-auto rounded-2xl shadow-2xl p-8 max-sm:p-4 gap-6 max-sm:gap-4">
        <div className="flex flex-col items-center w-full">
          <em className="text-4xl font-bold text-zinc-700 tracking-tight">
            To-do-
            <span className="text-sky-800">List</span>
          </em>
        </div>
        <div className="flex items-center gap-3 bg-white border border-sky-100 rounded-xl p-3 shadow-sm max-sm:flex-col">
          <input
            type="text"
            placeholder="O que você precisa fazer hoje?"
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
            onKeyDown={(e) => {if (e.key === "Enter") {adicionarTarefa()}}}
            className="flex-1 w-full min-w-0 bg-transparent outline-none text-zinc-700 placeholder:text-zinc-400"
          />
          <button
            type="button"
            onClick={adicionarTarefa}
            className="bg-sky-800 hover:bg-sky-900 transition-colors text-white font-semibold px-6 py-3 rounded-lg max-sm:w-full"
          >Adicionar</button>
        </div>
        <div className="flex items-center justify-between border-b border-sky-100 pb-3 gap-3 max-sm:flex-col max-sm:items-start">
          <div className="flex items-center gap-3 max-sm:w-full max-sm:gap-1">
            <button
              type="button"
              onClick={() => setFiltro("todas")}
              className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors max-sm:px-2 max-sm:flex-1 ${filtro === "todas" ? "bg-sky-800 text-white shadow-sm" : "bg-white text-zinc-500 hover:bg-sky-50 hover:text-sky-800"}`}
            >Todas</button>
            <button
              type="button"
              onClick={() => setFiltro("pendentes")}
              className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors max-sm:px-2 max-sm:flex-1 ${filtro === "pendentes" ? "bg-sky-800 text-white shadow-sm" : "bg-white text-zinc-500 hover:bg-sky-50 hover:text-sky-800"}`}
            >Pendentes</button>
            <button
              type="button"
              onClick={() => setFiltro("feitas")}
              className={`px-5 py-2 rounded-lg font-semibold text-sm transition-colors max-sm:px-2 max-sm:flex-1 ${filtro === "feitas" ? "bg-sky-800 text-white shadow-sm" : "bg-white text-zinc-500 hover:bg-sky-50 hover:text-sky-800"}`}
            >Feitas</button>
          </div>
          <strong className="text-white text-sm bg-sky-800 rounded-xl p-2 max-sm:self-end">
            {tarefas.length} tarefas
          </strong>
        </div>



        <div className="flex flex-col gap-4 pr-2 min-w-0">
          {tarefasFiltradas.map((tarefa) => (
            <div
              key={tarefa.id}
              className={`flex items-center justify-between gap-3 ${tarefa.concluida ? "bg-sky-50/60 border-green-600" : "bg-white border-red-600"} border-2 transition-colors rounded-xl py-2 px-3 shadow-sm max-sm:flex-wrap`}
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className={`${tarefa.concluida ? "hidden" : ""}`}>
                  <button
                    type="button"
                    onClick={() => concluirTarefa(tarefa.id)}
                    className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${tarefa.concluida ? "" : "border-red-900 hover:border-red-500 text-zinc-700"}`}
                  >{tarefa.concluida ? "" : "x"}
                  </button>
                </div>
                <div className={`font-medium wrap-break-word min-w-0 ${tarefa.concluida ? "text-zinc-400" : "text-zinc-700"}`}
                >{tarefa.titulo}
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center shrink-0">
                <button
                  type="button"
                  onClick={() => excluirTarefa(tarefa.id)}
                  className="text-zinc-700 hover:text-zinc-800 bg-white transition-colors px-3 py-1.5 rounded-lg text-sm font-semibold"
                ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                  </svg>
                </button>
                <div className="flex flex-row gap-2 items-center shrink-0">
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full text-white ${tarefa.concluida ? "bg-green-400" : "bg-red-400"}`}
                    >{tarefa.concluida ? "Concluída" : "Pendente"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
