-- ============================================================
-- AZ Ecosistema — Endurecimiento adicional (2026-07-04)
-- ------------------------------------------------------------
-- El advisor de seguridad de Supabase marca 8 funciones SECURITY DEFINER
-- invocables vía RPC público (/rest/v1/rpc/<fn>) por anon/authenticated.
--
-- De esas 8, `auth_tenant_id`, `is_staff`, `my_household_id` y `auth_role`
-- se usan dentro de políticas RLS (ver rls.sql) — revocarles EXECUTE
-- rompería el control de acceso. Además solo devuelven datos del propio
-- usuario que llama, así que exponerlas vía RPC no filtra nada nuevo.
--
-- Las otras 4 (`handle_new_user`, `apply_points_entry`, `log_score_change`,
-- `protect_profile_privileged_cols`) son funciones de trigger puras —
-- solo se invocan vía `for each row execute function ...`, nunca desde RLS
-- ni desde el cliente. No hay razón para que sean invocables por API.
-- ============================================================

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.apply_points_entry() from public, anon, authenticated;
revoke execute on function public.log_score_change() from public, anon, authenticated;
revoke execute on function public.protect_profile_privileged_cols() from public, anon, authenticated;
