from fastapi import HTTPException, status

from app.core.config import Settings, get_settings
from app.models.schemas import EventDetail


class AnthropicService:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()

    def _client(self):
        if not self.settings.anthropic_api_key:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="ANTHROPIC_API_KEY is required for AI-generated responses.",
            )
        try:
            from anthropic import Anthropic
        except ImportError as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="The anthropic package is not installed. Run pip install -r backend/requirements.txt.",
            ) from exc
        return Anthropic(api_key=self.settings.anthropic_api_key)

    def generate_analysis_narrative(
        self,
        event: EventDetail,
        variation_pct: float | None,
        precision_pct: float | None,
    ) -> str:
        real = event.realMdp if event.realMdp is not None else event.estimatedMdp
        variation = "sin dato real disponible" if variation_pct is None else f"{variation_pct:.1f}%"
        precision = "pendiente" if precision_pct is None else f"{precision_pct:.1f}%"
        prompt = (
            "Eres analista economico de SEDECO CDMX. Redacta un analisis ejecutivo "
            "en prosa, maximo 180 palabras, sin bullets.\n\n"
            f"Evento: {event.name}\n"
            f"Tipo: {event.type} / {event.subtype}\n"
            f"Alcaldia: {event.borough}\n"
            f"Afluencia: {event.realAttendance or event.expectedAttendance:,}\n"
            f"Derrama estimada: {event.estimatedMdp:.1f} mdp\n"
            f"Derrama real o base: {real:.1f} mdp\n"
            f"Variacion: {variation}\n"
            f"Precision: {precision}\n"
            f"Empleo directo: {event.directJobs:,}\n"
            f"Empleo indirecto: {event.indirectJobs:,}\n"
            f"Sectores: {', '.join(sector.name for sector in event.sectors[:5])}\n"
            "Cierra con una recomendacion operativa para la siguiente edicion."
        )
        return self._message(prompt)

    def generate_notification_draft(
        self,
        event: EventDetail,
        sector: str,
        borough: str | None,
    ) -> str:
        target_borough = borough or event.borough
        sector_amount = next((s.amount for s in event.sectors if s.name == sector), event.estimatedMdp * 0.15)
        prompt = (
            "Eres el area de comunicacion de SEDECO CDMX. Escribe un mensaje "
            "oficial, claro y cercano de maximo 150 palabras para duenos de MiPyMEs.\n\n"
            f"Sector: {sector}\n"
            f"Alcaldia: {target_borough}\n"
            f"Evento: {event.name}\n"
            f"Fecha: {event.date}\n"
            f"Lugar: {event.venue}\n"
            f"Afluencia esperada: {event.expectedAttendance:,}\n"
            f"Derrama estimada del sector: {sector_amount:.1f} mdp\n"
            "Incluye 2 recomendaciones practicas y firma como SEDECO CDMX."
        )
        return self._message(prompt)

    def _message(self, prompt: str) -> str:
        client = self._client()
        try:
            response = client.messages.create(
                model=self.settings.anthropic_model,
                max_tokens=self.settings.anthropic_max_tokens,
                messages=[{"role": "user", "content": prompt}],
            )
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Anthropic request failed: {exc}",
            ) from exc
        return "".join(
            block.text for block in response.content if getattr(block, "type", None) == "text"
        ).strip()
