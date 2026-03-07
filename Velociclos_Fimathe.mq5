//+------------------------------------------------------------------+
//| Velociclos_Fimathe.mq5 |
//| Igor Siqueira - Fimathe PCM + Velociclos |
//| v7.0 - Dois Modos: Automatico e Arrastar Continuo |
//+------------------------------------------------------------------+
#property copyright "Igor Siqueira | velociclos.vercel.app"
#property link "https://velociclos.vercel.app"
#property version "7.00"
#property strict
#property description "Velociclos Fimathe - Automatico e Arrastar Continuo"
#include <Trade\Trade.mqh>
#include <Trade\PositionInfo.mqh>
CTrade trade;
CPositionInfo position;
//=================================================================
// ENUMS
//=================================================================
enum ENUM_MODO_CANAL
{
   CANAL_AUTOMATICO = 0,
   CANAL_ARRASTAR = 1
};
enum ENUM_LOT_MODE
{
   LOT_RISCO_PERCENTUAL = 0,
   LOT_FIXO = 1
};
//=================================================================
// INPUTS
//=================================================================
input group "=== Deus é bom o tempo todo ==="
 int VelasParaCA = 4;
 double IgnorarCandleMaiorQue = 1.5;
 int OffsetVelasInicio = 0;
 bool DiagnosticoCA = true;
input group "=== Modo Operacional ==="
 input ENUM_MODO_CANAL ModoCanal = CANAL_AUTOMATICO;
 double CanalMaxPontos = 2000.0;
 double CanalMinPontos = 250.0;
input group "=== Gestao de Risco ==="
input ENUM_LOT_MODE ModoLotagem = LOT_RISCO_PERCENTUAL;
input double RiscoPorcentagem = 1.0;
input double LoteFixo = 0.01;
 bool UsarRiscoDecrescente = false;
 double FatorReducaoStop = 0.5;
 double MultiplicadorSegunda = 2;
input group "=== Break Even (0x0 desativado) ==="
 bool UsarBreakEven = false;
 double NiveisParaBE = 1.0;
input group "=== Limites - Modo Automatico ==="
 int MaxStopsDia = 3;
 int MaxStopsSemana = 3;
input group "=== Limites - Modo Arrastar ==="
 int MaxStopsSeguidosArrastar = 3;
input group "=== Santinho ==="
 int Santinho = 33;
input group "=== Visual ==="
 color CorCA = clrBlue;
 color CorC1 = clrBlue;
 color CorC2C3 = clrGreen;
 color CorSL = clrRed;
 bool ModoMinimalista = true;
//=================================================================
// CONSTANTES
//=================================================================
#define MAGIC_NUMBER 123456
#define MAX_DEALS_CHK 30
//=================================================================
// GLOBAIS — CANAL
//=================================================================
double CASupErior = 0;
double CAInferior = 0;
double AlturaCA = 0;
bool CA_Criado = false;
bool CA_Fatiado = false;
double HighOriginal4Velas= 0;
double C1Preco = 0;
double C2Preco = 0;
double C3Preco = 0;
bool C1_Criado = false;
bool C2_Criado = false;
bool C3_Criado = false;
//=================================================================
// GLOBAIS — CONTROLE DIARIO (Automatico)
//=================================================================
datetime UltimoDiaOperado = 0;
datetime UltimaBarraProc = 0;
bool CicloHojeIniciado = false;
int OrdensDoDia = 0;
int StopsDoDia = 0;
bool DiaBloqueado = false;
//=================================================================
// GLOBAIS — CONTROLE SEMANAL (Automatico)
//=================================================================
int StopsDaSemana = 0;
bool SemanaBloqueada = false;
int UltimaSemanaReg = -1;
//=================================================================
// GLOBAIS — PRIMEIRA OPERACAO
//=================================================================
bool PrimeiraExecutada = false;
bool PrimeiraFinalizada = false;
bool PrimeiraFoiStop = false;
bool DirecaoPrimeira = false;
ulong TicketPrimeira = 0;
double EntradaPrimeira = 0;
double SLPrimeira = 0;
double TPPrimeira = 0;
double DistStopPrimeira = 0;
//=================================================================
// GLOBAIS — SEGUNDA OPERACAO
//=================================================================
bool SegundaExecutada = false;
bool DirecaoSegunda = false;
double EntradaSegunda = 0;
double SLSegunda = 0;
double TPSegunda = 0;
//=================================================================
// GLOBAIS — BREAK EVEN
//=================================================================
bool BreakEvenAtivado = false;
ulong TicketBE = 0;
//=================================================================
// GLOBAIS — ARRASTAR CONTINUO
//=================================================================
bool LinhasArrastarOK = false;
bool LinhasFixadas = false;
int StopsSeguidosArrastar = 0;
datetime HoraFechamentoUltimaOrdem = 0;
bool WaitingForCandles = false;
// Controle de pausa por dia no Arrastar
datetime DiaBloqueiArrastar = 0; // Dia em que foi pausado (3 stops)
bool ArrastarPausadoDia = false; // Pausado ate proximo dia
bool PrimeiraOpDiaSeguinte = false; // Flag: fez 1a op do dia seguinte
// Novo para vertical line
datetime TempoVerticalSelect = 0;
//+------------------------------------------------------------------+
datetime GetAberturaD1() { return iTime(_Symbol, PERIOD_D1, 0); }
//+------------------------------------------------------------------+
//| Reseta ciclo Arrastar para novo CA automatico |
//+------------------------------------------------------------------+
void ResetarCicloArrastar()
{
   CA_Criado = false;
   CA_Fatiado = false;
   HighOriginal4Velas= 0;
   C1Preco = 0;
   C2Preco = 0;
   C3Preco = 0;
   C1_Criado = false;
   C2_Criado = false;
   C3_Criado = false;
   LinhasFixadas = false;
   PrimeiraExecutada = false;
   PrimeiraFinalizada= false;
   PrimeiraFoiStop = false;
   SegundaExecutada = false;
   OrdensDoDia = 0;
   StopsDoDia = 0;
   DiaBloqueado = false;
   TempoVerticalSelect = 0;
   WaitingForCandles = false;
   string nomes[] = {"Linha_CA_1","Linha_CA_2","Linha_C1","Linha_C2","Linha_C3","Linha_SL","Linha_Vertical_Select"};
   for(int i = 0; i < ArraySize(nomes); i++)
      if(ObjectFind(0, nomes[i]) != -1) ObjectDelete(0, nomes[i]);
   ChartRedraw();
   Print("Arrastar: ciclo resetado.");
}
//+------------------------------------------------------------------+
//| OnInit |
//+------------------------------------------------------------------+
int OnInit()
{
   trade.SetExpertMagicNumber(MAGIC_NUMBER);
   trade.SetDeviationInPoints(10);
   trade.SetTypeFilling(ORDER_FILLING_FOK);
   LimparObjetos();
   if(ModoCanal == CANAL_ARRASTAR)
   {
      bool temPosicao = false;
      for(int i = 0; i < PositionsTotal(); i++)
      {
         if(PositionGetTicket(i) > 0 &&
            PositionGetInteger(POSITION_MAGIC) == MAGIC_NUMBER &&
            PositionGetString(POSITION_SYMBOL) == _Symbol)
         {
            TicketPrimeira = PositionGetTicket(i);
            TicketBE = TicketPrimeira;
            PrimeiraExecutada = true;
            temPosicao = true;
            Print("Arrastar: posicao aberta encontrada. Ticket: ", TicketPrimeira);
            break;
         }
      }
      if(!temPosicao)
      {
         CriarLinhaVerticalSelect();
         Print("Modo Arrastar Continuo ativo. Arraste a linha vertical para selecionar a vela inicial do CA.");
      }
   }
   if(ModoCanal == CANAL_AUTOMATICO)
      Print("Modo Automatico | CA = primeiras ", VelasParaCA, " velas do dia");
   EventSetTimer(1);
   Print("Velociclos Fimathe v7.0 | Modo: ", EnumToString(ModoCanal));
   return(INIT_SUCCEEDED);
}
void OnDeinit(const int reason)
{
   EventKillTimer();
   if(ModoCanal == CANAL_AUTOMATICO) LimparObjetos();
   Comment("");
}
void OnTimer() { AtualizarInterface(); }
//+------------------------------------------------------------------+
//| OnChartEvent |
//+------------------------------------------------------------------+
void OnChartEvent(const int id, const long &lparam, const double &dparam, const string &sparam)
{
   if(id == CHARTEVENT_OBJECT_DRAG || id == CHARTEVENT_OBJECT_CHANGE)
   {
      if(sparam == "Linha_Vertical_Select")
      {
         datetime t = (datetime)ObjectGetInteger(0, "Linha_Vertical_Select", OBJPROP_TIME);
         int shift = iBarShift(_Symbol, PERIOD_CURRENT, t, false);
         if(shift < 1)
         {
            Print("Linha em vela aberta ou invalida - ajuste para vela fechada.");
            return;
         }
         TempoVerticalSelect = t;
         WaitingForCandles = true;
         ObjectSetInteger(0, "Linha_Vertical_Select", OBJPROP_SELECTABLE, false);
         ObjectSetInteger(0, "Linha_Vertical_Select", OBJPROP_SELECTED, false);
         ObjectSetInteger(0, "Linha_Vertical_Select", OBJPROP_COLOR, clrGray);
         Print("Marker definido em ", TimeToString(t), ". Aguardando ", VelasParaCA - 1, " proximas velas para formar CA incluindo a selecionada.");
      }
   }
}
//+------------------------------------------------------------------+
//| OnTick |
//+------------------------------------------------------------------+
void OnTick()
{
   AtualizarInterface();
   GerenciarBreakEven();
   // Controles de semana e dia apenas para modo Automatico
   if(ModoCanal == CANAL_AUTOMATICO)
   {
      VerificarNovaSemana();
      if(IsNovoDia()) ProcessarNovoDia();
   }
   VerificarPosicoes();
   datetime tempoAtual = iTime(_Symbol, PERIOD_CURRENT, 0);
   if(tempoAtual == UltimaBarraProc) return;
   UltimaBarraProc = tempoAtual;
   // -------------------------------------------------------
   // MODO ARRASTAR
   // -------------------------------------------------------
   if(ModoCanal == CANAL_ARRASTAR)
   {
      // Verifica pausa de dia (3 stops seguidos)
      if(ArrastarPausadoDia)
      {
         // Verifica se e novo dia
         datetime aberturaDiaAtual = GetAberturaD1();
         if(aberturaDiaAtual > DiaBloqueiArrastar)
         {
            // Novo dia chegou — aguarda 1a operacao antes de retomar infinito
            // Apenas libera para 1a operacao (sem resetar stops seguidos ainda)
            ArrastarPausadoDia = false;
            PrimeiraOpDiaSeguinte = true;
            StopsSeguidosArrastar = 0; // Zera ao iniciar novo dia
            CriarLinhaVerticalSelect();
            Print("Arrastar: novo dia apos pausa. Selecione o marker com a linha vertical.");
         }
         else
         {
            return; // Ainda no mesmo dia da pausa
         }
      }
      FluxoCanalArrastar();
      return;
   }
   // -------------------------------------------------------
   // MODO AUTOMATICO
   // -------------------------------------------------------
   if(SemanaBloqueada || DiaBloqueado) return;
   if(OrdensDoDia >= 2) return; // Fixo: max 2 ordens por dia (1a + 2a do mesmo CA)
   FluxoCanalAutomatico();
}
//+------------------------------------------------------------------+
//| FLUXO AUTOMATICO |
//+------------------------------------------------------------------+
void FluxoCanalAutomatico()
{
   datetime aberturaD1 = GetAberturaD1();
   if(TimeCurrent() < aberturaD1) return;
   int velasDoDia[200];
   int totalDia = 0;
   for(int s = 1; s < 500; s++)
   {
      datetime t = iTime(_Symbol, PERIOD_CURRENT, s);
      if(t <= 0) break;
      if(t >= aberturaD1) { velasDoDia[totalDia] = s; totalDia++; if(totalDia >= 200) break; }
      else break;
   }
   int velasNecessarias = VelasParaCA + OffsetVelasInicio;
   if(totalDia < velasNecessarias) return;
   int idxInicio = totalDia - 1 - OffsetVelasInicio;
   int idxFim = totalDia - VelasParaCA - OffsetVelasInicio;
   if(idxFim < 0) return;
   if(DiagnosticoCA && !CA_Criado)
   {
      Print("=== DIAGNOSTICO CA v7.0 ===");
      Print("Abertura D1: ", TimeToString(aberturaD1, TIME_DATE|TIME_MINUTES));
      Print("Total velas do dia: ", totalDia);
      for(int k = idxInicio; k >= idxFim; k--)
      {
         int s = velasDoDia[k];
         Print(" [", (idxInicio-k+1), "a vela] shift=", s,
               " | ", TimeToString(iTime(_Symbol,PERIOD_CURRENT,s), TIME_MINUTES),
               " | H:", DoubleToString(iHigh(_Symbol,PERIOD_CURRENT,s),_Digits),
               " | L:", DoubleToString(iLow (_Symbol,PERIOD_CURRENT,s),_Digits));
      }
      Print("=== FIM DIAGNOSTICO ===");
   }
   if(!CicloHojeIniciado) { CicloHojeIniciado = true; CA_Criado = false; }
   if(!CA_Criado) ConstruirCA(velasDoDia, idxInicio, idxFim);
   if(!CA_Criado) return;
   ExecutarLogicaFimathe();
}
//+------------------------------------------------------------------+
//| Constroi CA |
//+------------------------------------------------------------------+
void ConstruirCA(int &shifts[], int idxInicio, int idxFim)
{
   datetime aberturaD1 = GetAberturaD1();
   double maximo = -DBL_MAX, minimo = DBL_MAX;
   int velasLidas = 0;
   for(int k = idxInicio; k >= idxFim; k--)
   {
      int s = shifts[k];
      datetime t = iTime(_Symbol, PERIOD_CURRENT, s);
      if(t < aberturaD1) continue;
      double h = iHigh(_Symbol, PERIOD_CURRENT, s);
      double l = iLow (_Symbol, PERIOD_CURRENT, s);
      if(h <= 0 || l <= 0 || h == l) continue;
      maximo = MathMax(maximo, h);
      minimo = MathMin(minimo, l);
      velasLidas++;
   }
   if(velasLidas < VelasParaCA) return;
   maximo = NormalizeDouble(maximo, _Digits);
   minimo = NormalizeDouble(minimo, _Digits);
   Print("CA FORMADO | ", velasLidas, " velas | H:", DoubleToString(maximo,_Digits),
         " | L:", DoubleToString(minimo,_Digits),
         " | ", DoubleToString((maximo-minimo)/_Point,0), " pts");
   AplicarCanalComFatiamento(maximo, minimo);
}
//+------------------------------------------------------------------+
//| FLUXO ARRASTAR CONTINUO |
//+------------------------------------------------------------------+
void FluxoCanalArrastar()
{
   // =============================================================
   // FASE 1: Aguardando velas apos marker, incluindo a selecionada como inicial
   // =============================================================
   if(WaitingForCandles)
   {
      if(TempoVerticalSelect == 0) return;
      int velasNovas[200];
      int totalNovas = 0;
      for(int s = 1; s < 500; s++)
      {
         datetime t = iTime(_Symbol, PERIOD_CURRENT, s);
         if(t <= 0) break;
         if(t >= TempoVerticalSelect) { velasNovas[totalNovas] = s; totalNovas++; if(totalNovas >= 200) break; }
      }
      if(DiagnosticoCA)
         Print("Arrastar: ", totalNovas, "/", VelasParaCA, " velas incluindo/apos marker.");
      if(totalNovas < VelasParaCA) return;
      int idxInicio = totalNovas - 1;
      int idxFim = totalNovas - VelasParaCA;
      if(idxFim < 0) return;
      double maximo = -DBL_MAX, minimo = DBL_MAX;
      int lidas = 0;
      for(int k = idxInicio; k >= idxFim; k--)
      {
         int s = velasNovas[k];
         double h = iHigh(_Symbol, PERIOD_CURRENT, s);
         double l = iLow (_Symbol, PERIOD_CURRENT, s);
         if(h <= 0 || l <= 0 || h == l) continue;
         if(DiagnosticoCA)
            Print(" [CA Pos-Marker] vela ", (idxInicio-k+1),
                  " | ", TimeToString(iTime(_Symbol,PERIOD_CURRENT,s), TIME_MINUTES),
                  " | H:", DoubleToString(h,_Digits),
                  " | L:", DoubleToString(l,_Digits));
         maximo = MathMax(maximo, h);
         minimo = MathMin(minimo, l);
         lidas++;
      }
      if(lidas < VelasParaCA) return;
      maximo = NormalizeDouble(maximo, _Digits);
      minimo = NormalizeDouble(minimo, _Digits);
      AplicarCanalComFatiamento(maximo, minimo);
      if(CA_Criado)
      {
         WaitingForCandles = false;
         DesenharLinha("Linha_CA_1", CASupErior, CorCA, 3, false);
         DesenharLinha("Linha_CA_2", CAInferior, CorCA, 3, false);
         LinhasFixadas = true;
         Print("Arrastar: CA formado incluindo a vela selecionada como inicial | H:", DoubleToString(CASupErior,_Digits),
               " | L:", DoubleToString(CAInferior,_Digits),
               " | Stops seguidos: ", StopsSeguidosArrastar);
      }
      return;
   }
   // =============================================================
   // FASE 2: Operacional apos CA
   // =============================================================
   if(!CA_Criado) return;
   if(!LinhasFixadas)
   {
      DesenharLinha("Linha_CA_1", CASupErior, CorCA, 3, false);
      DesenharLinha("Linha_CA_2", CAInferior, CorCA, 3, false);
      LinhasFixadas = true;
   }
   // Modo Arrastar: sem limite de trades — opera sempre
   ExecutarLogicaFimathe();
}
//+------------------------------------------------------------------+
//| AplicarCanalComFatiamento |
//+------------------------------------------------------------------+
void AplicarCanalComFatiamento(double sup, double inf)
{
   if(sup < inf) { double t = sup; sup = inf; inf = t; }
   double altura = sup - inf;
   double emPontos = altura / _Point;
   if(emPontos < CanalMinPontos)
   {
      if(ModoCanal != CANAL_ARRASTAR) DiaBloqueado = true;
      Print("Canal pequeno (", DoubleToString(emPontos,0), " pts) - ignorado.");
      return;
   }
   if(emPontos > CanalMaxPontos)
   {
      double meio = NormalizeDouble((sup + inf) / 2.0, _Digits);
      CAInferior = NormalizeDouble(inf, _Digits);
      CASupErior = NormalizeDouble(meio, _Digits);
      AlturaCA = CASupErior - CAInferior;
      CA_Criado = true;
      CA_Fatiado = true;
      C1Preco = NormalizeDouble(sup, _Digits);
      C1_Criado = true;
      HighOriginal4Velas = C1Preco;
      DesenharLinha("Linha_CA_2", CAInferior, CorCA, 3, false);
      DesenharLinha("Linha_CA_1", CASupErior, CorCA, 3, false);
      DesenharLinha("Linha_C1", C1Preco, CorC1, 2, false);
      Print("FATIADO (", DoubleToString(emPontos,0), " pts)",
            " | CA:", DoubleToString(CAInferior,_Digits), " ~ ", DoubleToString(CASupErior,_Digits),
            " | C1:", DoubleToString(C1Preco,_Digits));
      return;
   }
   CAInferior = NormalizeDouble(inf, _Digits);
   CASupErior = NormalizeDouble(sup, _Digits);
   AlturaCA = CASupErior - CAInferior;
   CA_Criado = true;
   CA_Fatiado = false;
   HighOriginal4Velas = 0;
   DesenharLinha("Linha_CA_1", CASupErior, CorCA, 3, false);
   DesenharLinha("Linha_CA_2", CAInferior, CorCA, 3, false);
   Print("Canal OK (", DoubleToString(emPontos,0), " pts)",
         " | Sup:", DoubleToString(CASupErior,_Digits),
         " | Inf:", DoubleToString(CAInferior,_Digits));
}
//+------------------------------------------------------------------+
//| ExecutarLogicaFimathe |
//+------------------------------------------------------------------+
void ExecutarLogicaFimathe()
{
   double closePrev = iClose(_Symbol, PERIOD_CURRENT, 1);
   double highPrev = iHigh (_Symbol, PERIOD_CURRENT, 1);
   double lowPrev = iLow (_Symbol, PERIOD_CURRENT, 1);
   if(closePrev <= 0) return;
   double amp = highPrev - lowPrev;
   if(amp >= IgnorarCandleMaiorQue * AlturaCA) return;
   // --- C1 ---
   if(!C1_Criado)
   {
      if(closePrev > CASupErior || closePrev < CAInferior)
      {
         if(!LinhasFixadas)
         {
            DesenharLinha("Linha_CA_1", CASupErior, CorCA, 3, false);
            DesenharLinha("Linha_CA_2", CAInferior, CorCA, 3, false);
            LinhasFixadas = true;
         }
         C1Preco = (closePrev > CASupErior)
                     ? NormalizeDouble(CASupErior + AlturaCA, _Digits)
                     : NormalizeDouble(CAInferior - AlturaCA, _Digits);
         C1_Criado = true;
         DesenharLinha("Linha_C1", C1Preco, CorC1, 2, false);
         Print("C1 criado: ", DoubleToString(C1Preco, _Digits));
      }
      return;
   }
   // --- 1a ORDEM ---
   if(C1_Criado && !PrimeiraExecutada)
   {
      double linhas[3] = {CASupErior, CAInferior, C1Preco};
      ArraySort(linhas);
      double linhaTop = linhas[2];
      double linhaBottom = linhas[0];
      double alturaTotal = linhaTop - linhaBottom;
      double offset = (double)Santinho * _Point;
      if(closePrev > linhaTop)
      {
         C2Preco = NormalizeDouble(linhaTop + alturaTotal, _Digits);
         C2_Criado = true;
         DesenharLinha("Linha_C2", C2Preco, CorC2C3, 2, false);
         double tp = NormalizeDouble(C2Preco - offset, _Digits);
         double sl = NormalizeDouble(linhaBottom - offset, _Digits);
         DesenharLinha("Linha_SL", sl, CorSL, 1, false);
         if(AbrirOrdem(true, tp, sl, false))
            Print("PRIMEIRA COMPRA | TP:", DoubleToString(tp,_Digits), " | SL:", DoubleToString(sl,_Digits));
      }
      else if(closePrev < linhaBottom)
      {
         C2Preco = NormalizeDouble(linhaBottom - alturaTotal, _Digits);
         C2_Criado = true;
         DesenharLinha("Linha_C2", C2Preco, CorC2C3, 2, false);
         double tp = NormalizeDouble(C2Preco + offset, _Digits);
         double sl = NormalizeDouble(linhaTop + offset, _Digits);
         DesenharLinha("Linha_SL", sl, CorSL, 1, false);
         if(AbrirOrdem(false, tp, sl, false))
            Print("PRIMEIRA VENDA | TP:", DoubleToString(tp,_Digits), " | SL:", DoubleToString(sl,_Digits));
      }
      return;
   }
   // --- 2a ORDEM (apos stop na 1a) ---
   if(PrimeiraExecutada && PrimeiraFinalizada && !SegundaExecutada && PrimeiraFoiStop)
   {
      if(!C3_Criado)
      {
         double todasLinhas[4] = {CASupErior, CAInferior, C1Preco, C2Preco};
         ArraySort(todasLinhas);
         double extremoTop = todasLinhas[3];
         double extremoBottom = todasLinhas[0];
         double alturaTotal = extremoTop - extremoBottom;
         if(closePrev > extremoTop || closePrev < extremoBottom)
         {
            C3Preco = (closePrev > extremoTop)
                        ? NormalizeDouble(extremoTop + alturaTotal, _Digits)
                        : NormalizeDouble(extremoBottom - alturaTotal, _Digits);
            C3_Criado = true;
            DesenharLinha("Linha_C3", C3Preco, CorC2C3, 2, false);
            Print("C3 criado: ", DoubleToString(C3Preco, _Digits));
         }
      }
      if(C3_Criado)
      {
         bool dirSegunda = DeterminarDirecaoSegunda();
         double offset = (double)Santinho * _Point;
         double tp = dirSegunda
                             ? NormalizeDouble(C3Preco - offset, _Digits)
                             : NormalizeDouble(C3Preco + offset, _Digits);
         double entradaSeg = dirSegunda
                             ? SymbolInfoDouble(_Symbol, SYMBOL_ASK)
                             : SymbolInfoDouble(_Symbol, SYMBOL_BID);
         double sl = CalcularSLSegunda(dirSegunda, entradaSeg);
         DesenharLinha("Linha_SL", sl, CorSL, 1, false);
         if(AbrirOrdem(dirSegunda, tp, sl, true))
            Print("SEGUNDA OPERACAO ", (dirSegunda?"COMPRA":"VENDA"),
                  " | TP:", DoubleToString(tp,_Digits),
                  " | SL:", DoubleToString(sl,_Digits));
      }
   }
}
bool DeterminarDirecaoSegunda()
{
   double closeAtual = iClose(_Symbol, PERIOD_CURRENT, 1);
   double linhas[4] = {CASupErior, CAInferior, C1Preco, C2Preco};
   ArraySort(linhas);
   if(closeAtual > linhas[3]) return true;
   if(closeAtual < linhas[0]) return false;
   return DirecaoPrimeira;
}
double CalcularSLSegunda(bool direcao, double entrada)
{
   double distancia = DistStopPrimeira + Santinho;
   return direcao
          ? NormalizeDouble(entrada - distancia * _Point, _Digits)
          : NormalizeDouble(entrada + distancia * _Point, _Digits);
}
//+------------------------------------------------------------------+
//| AbrirOrdem |
//+------------------------------------------------------------------+
bool AbrirOrdem(bool isBuy, double tp, double sl, bool isSegunda)
{
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   if(ask <= 0 || bid <= 0) { Print("Precos invalidos"); return false; }
   double price = isBuy ? ask : bid;
   double lote = CalcularLote(sl, isBuy, isSegunda);
   if(lote <= 0) { Print("Lote invalido: ", lote); return false; }
   tp = NormalizeDouble(tp, _Digits);
   sl = NormalizeDouble(sl, _Digits);
   if( isBuy && tp <= price) { Print("TP invalido BUY"); return false; }
   if(!isBuy && tp >= price) { Print("TP invalido SELL"); return false; }
   if( isBuy && sl >= price) { Print("SL invalido BUY"); return false; }
   if(!isBuy && sl <= price) { Print("SL invalido SELL"); return false; }
   bool ok = isBuy ? trade.Buy(lote,_Symbol,price,sl,tp) : trade.Sell(lote,_Symbol,price,sl,tp);
   if(ok)
   {
      ulong ticket = trade.ResultOrder();
      double rr = MathAbs(tp-price) > 0 ? MathAbs(tp-price)/MathAbs(price-sl) : 0;
      if(!isSegunda)
      {
         PrimeiraExecutada = true;
         TicketPrimeira = ticket;
         EntradaPrimeira = price;
         SLPrimeira = sl;
         TPPrimeira = tp;
         DirecaoPrimeira = isBuy;
         DistStopPrimeira = MathAbs(price-sl)/_Point;
         TicketBE = ticket;
         BreakEvenAtivado = false;
         OrdensDoDia++;
         // Se e a 1a operacao do dia seguinte apos pausa no Arrastar
         if(ModoCanal == CANAL_ARRASTAR && PrimeiraOpDiaSeguinte)
            PrimeiraOpDiaSeguinte = false; // Liberado — ciclo infinito retomado
      }
      else
      {
         SegundaExecutada = true;
         EntradaSegunda = price;
         SLSegunda = sl;
         TPSegunda = tp;
         DirecaoSegunda = isBuy;
         TicketBE = ticket;
         BreakEvenAtivado = false;
         OrdensDoDia++;
      }
      Print(">>> ", (isBuy?"BUY":"SELL"), (isSegunda?" [2a]":" [1a]"),
            " | Lote:", lote,
            " | Entrada:", DoubleToString(price,_Digits),
            " | SL:", DoubleToString(sl,_Digits),
            " | TP:", DoubleToString(tp,_Digits),
            " | RR 1:", DoubleToString(rr,2),
            " | Ticket:", ticket);
   }
   else Print("ERRO ao abrir ordem: ", trade.ResultRetcodeDescription());
   return ok;
}
//+------------------------------------------------------------------+
//| CalcularLote |
//+------------------------------------------------------------------+
double CalcularLote(double sl, bool isBuy, bool isSegunda = false)
{
   double price = isBuy ? SymbolInfoDouble(_Symbol,SYMBOL_ASK) : SymbolInfoDouble(_Symbol,SYMBOL_BID);
   double lote = 0;
   if(ModoLotagem == LOT_FIXO)
   {
      lote = LoteFixo;
   }
   else
   {
      double conta = AccountInfoDouble(ACCOUNT_BALANCE);
      double tickVal = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
      double tickSize = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
      double slPts = MathAbs(sl - price) / _Point;
      if(conta <= 0 || tickVal <= 0 || tickSize <= 0 || slPts <= 0) return AjustarVolume(LoteFixo);
      double valPonto = tickVal * (_Point / tickSize);
      if(valPonto <= 0) return AjustarVolume(LoteFixo);
      double fator = 1.0;
      if(UsarRiscoDecrescente && StopsDoDia >= 1)
      {
         fator = FatorReducaoStop;
         Print("Risco reduzido: ", DoubleToString(RiscoPorcentagem*fator,2), "%");
      }
      double valorRisco = conta * (RiscoPorcentagem / 100.0) * fator;
      lote = valorRisco / (slPts * valPonto);
   }
   if(isSegunda) lote *= MultiplicadorSegunda;
   return AjustarVolume(lote);
}
double AjustarVolume(double vol)
{
   double minL = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double maxL = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double step = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   if(step <= 0) step = 0.01;
   return MathMax(minL, MathMin(maxL, NormalizeDouble(vol/step,0)*step));
}
//+------------------------------------------------------------------+
//| GerenciarBreakEven |
//+------------------------------------------------------------------+
void GerenciarBreakEven()
{
   if(!UsarBreakEven || BreakEvenAtivado || TicketBE == 0) return;
   if(!PositionSelectByTicket(TicketBE)) return;
   double entrada = PositionGetDouble(POSITION_PRICE_OPEN);
   double slAtual = PositionGetDouble(POSITION_SL);
   double tpAtual = PositionGetDouble(POSITION_TP);
   double precoNow = PositionGetDouble(POSITION_PRICE_CURRENT);
   bool isBuy = (PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_BUY);
   double alvo = NiveisParaBE * AlturaCA;
   if(isBuy && slAtual < entrada && precoNow >= entrada + alvo)
   {
      double novoSL = NormalizeDouble(entrada + 2*_Point, _Digits);
      if(trade.PositionModify(TicketBE, novoSL, tpAtual))
      {
         BreakEvenAtivado = true;
         DesenharLinha("Linha_SL", novoSL, CorSL, 1, false);
         Print("BE ativado BUY -> SL:", DoubleToString(novoSL,_Digits));
      }
   }
   else if(!isBuy && slAtual > entrada && precoNow <= entrada - alvo)
   {
      double novoSL = NormalizeDouble(entrada - 2*_Point, _Digits);
      if(trade.PositionModify(TicketBE, novoSL, tpAtual))
      {
         BreakEvenAtivado = true;
         DesenharLinha("Linha_SL", novoSL, CorSL, 1, false);
         Print("BE ativado SELL -> SL:", DoubleToString(novoSL,_Digits));
      }
   }
}
//+------------------------------------------------------------------+
//| VerificarPosicoes |
//+------------------------------------------------------------------+
void VerificarPosicoes()
{
   // --- 1a ORDEM ---
   if(PrimeiraExecutada && !PrimeiraFinalizada && TicketPrimeira > 0)
   {
      if(!PositionSelectByTicket(TicketPrimeira))
      {
         PrimeiraFinalizada = true;
         PrimeiraFoiStop = VerificarSLNoHistorico(TicketPrimeira);
         datetime horaFechamento = TimeCurrent();
         HistorySelect(TimeCurrent() - 86400, TimeCurrent());
         int total = HistoryDealsTotal();
         for(int i = total-1; i >= MathMax(0, total-MAX_DEALS_CHK); i--)
         {
            ulong dt = HistoryDealGetTicket(i);
            if((ulong)HistoryDealGetInteger(dt, DEAL_POSITION_ID) == TicketPrimeira &&
               HistoryDealGetInteger(dt, DEAL_ENTRY) == DEAL_ENTRY_OUT)
            {
               horaFechamento = (datetime)HistoryDealGetInteger(dt, DEAL_TIME);
               break;
            }
         }
         // Marca linha vertical de fechamento (ja como marker fixo)
         string name_marker = "Marker_Close_" + IntegerToString((long)horaFechamento);
         ObjectCreate(0, name_marker, OBJ_VLINE, 0, horaFechamento, 0);
         ObjectSetInteger(0, name_marker, OBJPROP_COLOR, PrimeiraFoiStop ? clrRed : clrGreen);
         ObjectSetInteger(0, name_marker, OBJPROP_WIDTH, 1);
         ObjectSetInteger(0, name_marker, OBJPROP_SELECTABLE, false);
         ObjectSetString(0, name_marker, OBJPROP_TOOLTIP, PrimeiraFoiStop ? "Stop" : "TP");
         ChartRedraw();
         // Define como novo marker para aguardar velas
         TempoVerticalSelect = horaFechamento;
         WaitingForCandles = true;
         if(PrimeiraFoiStop)
         {
            StopsDoDia++;
            StopsDaSemana++;
            Print("STOP 1a | Dia:", StopsDoDia, " | Semana:", StopsDaSemana);
            if(ModoCanal == CANAL_ARRASTAR)
            {
               StopsSeguidosArrastar++;
               Print("Stops seguidos Arrastar: ", StopsSeguidosArrastar, "/", MaxStopsSeguidosArrastar);
               if(StopsSeguidosArrastar >= MaxStopsSeguidosArrastar)
               {
                  ArrastarPausadoDia = true;
                  DiaBloqueiArrastar = GetAberturaD1();
                  Print("ARRASTAR PAUSADO - ", MaxStopsSeguidosArrastar, " stops seguidos. Retoma amanha.");
                  TicketPrimeira = 0;
                  if(TicketBE == TicketPrimeira) { TicketBE = 0; BreakEvenAtivado = false; }
                  return;
               }
               ResetarCicloArrastar();
               TempoVerticalSelect = horaFechamento;
               WaitingForCandles = true;
            }
            else
            {
               AplicarBloqueios();
               if(!DiaBloqueado && !SemanaBloqueada && OrdensDoDia < 2)
               {
                  C1_Criado = false; C2_Criado = false;
                  if(ObjectFind(0,"Linha_C1") != -1) ObjectDelete(0,"Linha_C1");
                  if(ObjectFind(0,"Linha_C2") != -1) ObjectDelete(0,"Linha_C2");
                  if(ObjectFind(0,"Linha_SL") != -1) ObjectDelete(0,"Linha_SL");
                  if(CA_Fatiado && HighOriginal4Velas > 0)
                  {
                     C1Preco = HighOriginal4Velas; C1_Criado = true;
                     DesenharLinha("Linha_C1", C1Preco, CorC1, 2, false);
                  }
                  Print("Canal mantido | ", 2 - OrdensDoDia, " tentativa(s) restante(s).");
               }
            }
         }
         else
         {
            // TP ou fechamento manual
            if(ModoCanal == CANAL_ARRASTAR)
            {
               StopsSeguidosArrastar = 0;
               ResetarCicloArrastar();
               TempoVerticalSelect = horaFechamento;
               WaitingForCandles = true;
               Print("TP 1a no Arrastar. Stops zerados. Aguardando ", VelasParaCA, " velas apos marker.");
            }
            else
            {
               DiaBloqueado = true;
               Print("TP 1a - dia concluido.");
            }
         }
         if(TicketBE == TicketPrimeira) { TicketBE = 0; BreakEvenAtivado = false; }
         TicketPrimeira = 0;
      }
   }
   // --- 2a ORDEM ---
   if(SegundaExecutada && TicketBE > 0)
   {
      if(!PositionSelectByTicket(TicketBE))
      {
         bool foiStop = VerificarSLNoHistorico(TicketBE);
         datetime horaFechamento = TimeCurrent();
         HistorySelect(TimeCurrent() - 86400, TimeCurrent());
         int total = HistoryDealsTotal();
         for(int i = total-1; i >= MathMax(0, total-MAX_DEALS_CHK); i--)
         {
            ulong dt = HistoryDealGetTicket(i);
            if((ulong)HistoryDealGetInteger(dt, DEAL_POSITION_ID) == TicketBE &&
               HistoryDealGetInteger(dt, DEAL_ENTRY) == DEAL_ENTRY_OUT)
            {
               horaFechamento = (datetime)HistoryDealGetInteger(dt, DEAL_TIME);
               break;
            }
         }
         // Marca linha vertical de fechamento
         string name_marker = "Marker_Close_" + IntegerToString((long)horaFechamento);
         ObjectCreate(0, name_marker, OBJ_VLINE, 0, horaFechamento, 0);
         ObjectSetInteger(0, name_marker, OBJPROP_COLOR, foiStop ? clrRed : clrGreen);
         ObjectSetInteger(0, name_marker, OBJPROP_WIDTH, 1);
         ObjectSetInteger(0, name_marker, OBJPROP_SELECTABLE, false);
         ObjectSetString(0, name_marker, OBJPROP_TOOLTIP, foiStop ? "Stop" : "TP");
         ChartRedraw();
         // Define como novo marker para aguardar velas
         TempoVerticalSelect = horaFechamento;
         WaitingForCandles = true;
         if(foiStop)
         {
            StopsDoDia++;
            StopsDaSemana++;
            Print("STOP 2a | Dia:", StopsDoDia, " | Semana:", StopsDaSemana);
            if(ModoCanal == CANAL_ARRASTAR)
            {
               StopsSeguidosArrastar++;
               Print("Stops seguidos Arrastar: ", StopsSeguidosArrastar, "/", MaxStopsSeguidosArrastar);
               if(StopsSeguidosArrastar >= MaxStopsSeguidosArrastar)
               {
                  ArrastarPausadoDia = true;
                  DiaBloqueiArrastar = GetAberturaD1();
                  Print("ARRASTAR PAUSADO - ", MaxStopsSeguidosArrastar, " stops seguidos. Retoma amanha.");
                  TicketBE = 0; BreakEvenAtivado = false;
                  return;
               }
               ResetarCicloArrastar();
               TempoVerticalSelect = horaFechamento;
               WaitingForCandles = true;
            }
            else AplicarBloqueios();
         }
         else
         {
            if(ModoCanal == CANAL_ARRASTAR)
            {
               StopsSeguidosArrastar = 0;
               ResetarCicloArrastar();
               TempoVerticalSelect = horaFechamento;
               WaitingForCandles = true;
               Print("TP 2a no Arrastar. Stops zerados. Aguardando ", VelasParaCA, " velas apos marker.");
            }
            else
            {
               DiaBloqueado = true;
               Print("TP 2a - dia concluido.");
            }
         }
         TicketBE = 0; BreakEvenAtivado = false;
      }
   }
}
void AplicarBloqueios()
{
   if(StopsDaSemana >= MaxStopsSemana) { SemanaBloqueada = true; DiaBloqueado = true; Print("SEMANA BLOQUEADA."); }
   else if(StopsDoDia >= MaxStopsDia) { DiaBloqueado = true; Print("DIA BLOQUEADO."); }
}
bool VerificarSLNoHistorico(ulong ticket)
{
   if(ticket == 0) return false;
   HistorySelect(TimeCurrent() - 86400, TimeCurrent());
   int total = HistoryDealsTotal();
   for(int i = total-1; i >= MathMax(0, total-MAX_DEALS_CHK); i--)
   {
      ulong dt = HistoryDealGetTicket(i);
      if((ulong)HistoryDealGetInteger(dt, DEAL_POSITION_ID) == ticket &&
         HistoryDealGetInteger(dt, DEAL_ENTRY) == DEAL_ENTRY_OUT &&
         HistoryDealGetInteger(dt, DEAL_REASON) == DEAL_REASON_SL)
         return true;
   }
   return false;
}
//+------------------------------------------------------------------+
//| Controle dias/semanas — apenas Automatico |
//+------------------------------------------------------------------+
bool IsNovoDia()
{
   datetime agora = iTime(_Symbol, PERIOD_CURRENT, 0);
   MqlDateTime ea, eu;
   TimeToStruct(agora, ea);
   TimeToStruct(UltimoDiaOperado, eu);
   return (ea.day != eu.day || ea.mon != eu.mon || ea.year != eu.year);
}
void ProcessarNovoDia()
{
   bool temPosicaoVirada = (PrimeiraExecutada && !PrimeiraFinalizada) ||
                           (SegundaExecutada && TicketBE > 0);
   ResetarDia();
   UltimoDiaOperado = iTime(_Symbol, PERIOD_CURRENT, 0);
   if(temPosicaoVirada) Print("Novo dia | Posicao da virada mantida.");
   else Print("Novo dia - ciclo resetado.", SemanaBloqueada ? " Semana ainda bloqueada!" : "");
}
void ResetarDia()
{
   CA_Criado = false;
   C1_Criado = false;
   C2_Criado = false;
   C3_Criado = false;
   CicloHojeIniciado = false;
   StopsDoDia = 0;
   OrdensDoDia = 0;
   DiaBloqueado = false;
   CA_Fatiado = false;
   HighOriginal4Velas= 0;
   LinhasFixadas = false;
   PrimeiraExecutada = false;
   PrimeiraFinalizada= false;
   PrimeiraFoiStop = false;
   SegundaExecutada = false;
   LimparObjetos();
}
void VerificarNovaSemana()
{
   int sem = GetNumeroSemana(TimeCurrent());
   if(sem == UltimaSemanaReg) return;
   int ant = StopsDaSemana;
   StopsDaSemana = 0; SemanaBloqueada = false; UltimaSemanaReg = sem;
   Print("Nova semana (", sem, ")", ant > 0 ? " | Anterior: " + IntegerToString(ant) + " stops." : "");
}
int GetNumeroSemana(datetime dt)
{
   MqlDateTime e; TimeToStruct(dt, e);
   int ds = e.day_of_week;
   return (int)MathFloor((e.day_of_year + 6 - (ds == 0 ? 6 : ds - 1)) / 7);
}
//+------------------------------------------------------------------+
//| AtualizarInterface |
//+------------------------------------------------------------------+
void AtualizarInterface()
{
   if(!ModoMinimalista) return;
   datetime velaAtual = iTime(_Symbol, PERIOD_CURRENT, 0);
   long segsRest = PeriodSeconds() - (long)(TimeCurrent() - velaAtual);
   if(segsRest < 0) segsRest = 0;
   string status;
   if(ModoCanal == CANAL_ARRASTAR)
   {
      if(ArrastarPausadoDia)
         status = "⛔ PAUSADO - 3 stops. Retoma no proximo dia";
      else if(WaitingForCandles)
      {
         int velasNovas = 0;
         for(int s = 1; s < 500; s++)
         {
            datetime t = iTime(_Symbol, PERIOD_CURRENT, s);
            if(t <= 0) break;
            if(t >= TempoVerticalSelect) velasNovas++;
         }
         status = StringFormat("⏳ Aguardando %d/%d velas incluindo marker...", velasNovas, VelasParaCA);
      }
      else if(SegundaExecutada && TicketBE > 0)
         status = BreakEvenAtivado ? "✅ 2a Ordem ativa | BE ON" : "🔄 2a Ordem ativa...";
      else if(PrimeiraExecutada && !PrimeiraFinalizada)
         status = BreakEvenAtivado ? "✅ 1a Ordem ativa | BE ON" : "🔄 1a Ordem ativa...";
      else if(PrimeiraFinalizada && PrimeiraFoiStop && !SegundaExecutada)
         status = C3_Criado ? "⏳ Aguardando 2a entrada..." : "⏳ Stop 1a | Aguardando C3...";
      else if(C1_Criado)
         status = CA_Fatiado ? "🔍 FAT | C1 auto | Aguardando C2..." : "🔍 C1 ok | Aguardando entrada...";
      else if(CA_Criado)
         status = "🔍 Canal ok | Aguardando C1...";
      else
         status = "✏️ Arraste a linha vertical para selecionar vela inicial...";
   }
   else // AUTOMATICO
   {
      if(SemanaBloqueada)
         status = StringFormat("⛔ SEMANA BLOQUEADA (%d/%d)", StopsDaSemana, MaxStopsSemana);
      else if(DiaBloqueado)
         status = "⛔ Dia bloqueado — amanha";
      else if(SegundaExecutada && TicketBE > 0)
         status = BreakEvenAtivado ? "✅ 2a Ordem ativa | BE ON" : "🔄 2a Ordem ativa...";
      else if(PrimeiraExecutada && !PrimeiraFinalizada)
         status = BreakEvenAtivado ? "✅ 1a Ordem ativa | BE ON" : "🔄 1a Ordem ativa...";
      else if(PrimeiraFinalizada && PrimeiraFoiStop && !SegundaExecutada)
         status = C3_Criado ? "⏳ Aguardando 2a entrada..." : "⏳ Stop 1a | Aguardando C3...";
      else if(C1_Criado)
         status = CA_Fatiado ? "🔍 FAT | C1 auto | Aguardando C2..." : "🔍 C1 ok | Aguardando entrada...";
      else if(CA_Criado)
         status = "🔍 Canal ok | Aguardando C1...";
      else if(TimeCurrent() < GetAberturaD1())
         status = "⏳ Aguardando abertura do dia...";
      else
      {
         datetime aberturaD1 = GetAberturaD1();
         int velasHoje = 0;
         for(int s = 1; s < 500; s++)
         {
            datetime t = iTime(_Symbol, PERIOD_CURRENT, s);
            if(t <= 0 || t < aberturaD1) break;
            velasHoje++;
         }
         status = StringFormat("⏳ CA: %d/%d velas do dia...", MathMin(velasHoje, VelasParaCA), VelasParaCA);
      }
   }
   string canalInfo = "";
   if(CA_Criado)
      canalInfo = CA_Fatiado
         ? StringFormat("CA %.0f pts | %s ~ %s [FAT] | C1: %s",
                        AlturaCA/_Point,
                        DoubleToString(CAInferior,_Digits),
                        DoubleToString(CASupErior,_Digits),
                        DoubleToString(C1Preco,_Digits))
         : StringFormat("CA %.0f pts | %s ~ %s",
                        AlturaCA/_Point,
                        DoubleToString(CAInferior,_Digits),
                        DoubleToString(CASupErior,_Digits));
   string ordemInfo = "";
   if(PrimeiraExecutada && !PrimeiraFinalizada && TicketPrimeira > 0 &&
      PositionSelectByTicket(TicketPrimeira))
      ordemInfo = StringFormat("SL %s | TP %s | BE %s",
                               DoubleToString(PositionGetDouble(POSITION_SL),_Digits),
                               DoubleToString(PositionGetDouble(POSITION_TP),_Digits),
                               BreakEvenAtivado ? "ON ✅" : "OFF");
   string arrastarInfo = "";
   if(ModoCanal == CANAL_ARRASTAR)
      arrastarInfo = StringFormat("Stops seguidos: %d/%d | %s",
                                  StopsSeguidosArrastar, MaxStopsSeguidosArrastar,
                                  PrimeiraOpDiaSeguinte ? "Aguard. 1a op dia seguinte..." : "Ciclo infinito ativo");
   string limiteInfo = "";
   if(ModoCanal == CANAL_AUTOMATICO)
      limiteInfo = StringFormat("Ordens: %d/2 | Stops dia: %d/%d | Stops sem: %d/%d",
                                OrdensDoDia, StopsDoDia, MaxStopsDia, StopsDaSemana, MaxStopsSemana);
   Comment(StringFormat(
      "Velociclos Fimathe v7.0\n"
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
      "%s\n"
      "%s\n"
      "%s\n"
      "━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
      "Modo : %s\n"
      "%s\n"
      "%s\n"
      "Prox vela: %02d:%02d\n"
      "━━━━━━━━━━━━━━━━━━━━━━━━━━",
      status, canalInfo, ordemInfo,
      EnumToString(ModoCanal),
      arrastarInfo, limiteInfo,
      (int)(segsRest/60), (int)(segsRest%60)
   ));
}
//+------------------------------------------------------------------+
//| Desenho |
//+------------------------------------------------------------------+
void DesenharLinha(string nome, double preco, color cor, int largura, bool arrastavel)
{
   if(ObjectFind(0, nome) != -1) ObjectDelete(0, nome);
   ObjectCreate(0, nome, OBJ_HLINE, 0, 0, preco);
   ObjectSetDouble (0, nome, OBJPROP_PRICE, preco);
   ObjectSetInteger(0, nome, OBJPROP_COLOR, cor);
   ObjectSetInteger(0, nome, OBJPROP_WIDTH, largura);
   ObjectSetInteger(0, nome, OBJPROP_STYLE, STYLE_SOLID);
   ObjectSetInteger(0, nome, OBJPROP_SELECTABLE,arrastavel);
   ObjectSetInteger(0, nome, OBJPROP_SELECTED, false);
   ObjectSetInteger(0, nome, OBJPROP_BACK, false);
   ObjectSetString (0, nome, OBJPROP_TOOLTIP, nome + ": " + DoubleToString(preco,_Digits));
   ChartRedraw();
}
void CriarLinhaVerticalSelect()
{
   datetime t = iTime(_Symbol, PERIOD_CURRENT, 1);
   if(ObjectFind(0, "Linha_Vertical_Select") != -1) ObjectDelete(0, "Linha_Vertical_Select");
   ObjectCreate(0, "Linha_Vertical_Select", OBJ_VLINE, 0, t, 0);
   ObjectSetInteger(0, "Linha_Vertical_Select", OBJPROP_COLOR, clrYellow);
   ObjectSetInteger(0, "Linha_Vertical_Select", OBJPROP_WIDTH, 2);
   ObjectSetInteger(0, "Linha_Vertical_Select", OBJPROP_STYLE, STYLE_DASH);
   ObjectSetInteger(0, "Linha_Vertical_Select", OBJPROP_SELECTABLE, true);
   ObjectSetInteger(0, "Linha_Vertical_Select", OBJPROP_SELECTED, true);
   ObjectSetString (0, "Linha_Vertical_Select", OBJPROP_TOOLTIP, "Arraste para selecionar vela inicial do CA");
   ChartRedraw();
}
void LimparObjetos()
{
   string nomes[] = {"Linha_CA_1","Linha_CA_2","Linha_C1","Linha_C2","Linha_C3","Linha_SL","Linha_Vertical_Select"};
   for(int i = 0; i < ArraySize(nomes); i++)
      if(ObjectFind(0, nomes[i]) != -1) ObjectDelete(0, nomes[i]);
   ChartRedraw();
}