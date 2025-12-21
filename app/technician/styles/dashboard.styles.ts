// app/technician/styles/dashboard.styles.ts
import { StyleSheet } from 'react-native';

const colors = {
  primary: '#10518b',     // Azul principal
  dark: '#343433',        // Gris oscuro
  white: '#ffffff',       // Blanco
  lightBlue: '#5faee3',   // Azul claro
  background: '#f8fafc',  // Fondo claro
  lightGray: '#f1f5f9',   // Gris muy claro
  mediumGray: '#94a3b8',  // Gris medio
  borderGray: '#e2e8f0',  // Gris para bordes
  textLight: '#64748b',   // Texto claro
  warning: '#ef4444',     // Rojo para pendientes
  success: '#10b981',     // Verde para éxito
  orange: '#f59e0b',      // Naranja para prioridad alta
  purple: '#5faee3',      // Morado para accesos
  softBlue: '#e6f2ff',    // Azul muy claro
};

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: colors.primary,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userAvatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  userAvatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: colors.lightBlue,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: colors.lightBlue + 'CC',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 8,
  },
  roleBadge: {
    backgroundColor: colors.lightBlue + '30',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightBlue + '50',
    marginTop: 8,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  welcomeCard: {
    backgroundColor: colors.white,
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 20,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
  },
  highlightText: {
    color: colors.primary,
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderTopWidth: 4,
  },
  statCardTotal: {
    borderTopColor: colors.primary,
  },
  statCardPending: {
    borderTopColor: colors.warning,
  },
  statCardReview: {
    borderTopColor: colors.lightBlue,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.dark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 2,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.warning,
    marginTop: 4,
  },
  prioritySection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  priorityContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  priorityItem: {
    flex: 1,
    alignItems: 'center',
  },
  priorityBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  priorityHigh: {
    backgroundColor: colors.orange,
  },
  priorityMedium: {
    backgroundColor: colors.lightBlue,
  },
  priorityLow: {
    backgroundColor: colors.success,
  },
  priorityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 4,
  },
  priorityValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark,
  },
  priorityDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderGray,
  },
  quickAccessSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAccessCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
    borderLeftWidth: 4,
  },
  accessPrimary: {
    borderLeftColor: colors.primary,
  },
  accessSecondary: {
    borderLeftColor: colors.purple,
  },
  accessIconContainer: {
    backgroundColor: colors.lightGray,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  accessIcon: {
    fontSize: 22,
  },
  accessTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 4,
  },
  accessDescription: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
  accessBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accessBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  logoutButton: {
    marginHorizontal: 24,
    marginBottom: 40,
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: colors.warning,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  logoutButtonIcon: {
    fontSize: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.warning,
  },
});