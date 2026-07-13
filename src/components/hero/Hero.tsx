import { useI18n } from "@/lib/i18n";
import { useInvitee } from "@/lib/invitee";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
  const { locale } = useI18n();
  const { invitee } = useInvitee();

  const name = invitee
    ? locale === "ar"
      ? invitee.nameAr
      : invitee.name
    : undefined;

  return <HeroVideo inviteeName={name} />;
}
