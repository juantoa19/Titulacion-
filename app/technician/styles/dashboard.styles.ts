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
  success: '#10b981',     // Verde
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
  },
  headerContent: {
    marginBottom: 16,
  },
  userInfo: {
    marginBottom: 8,
  },
  greeting: {
    fontSize: 14,
    color: colors.lightBlue,
    marginBottom: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.lightBlue,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
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
    fontSize: 12,
    fontWeight: '600',
    color: colors.mediumGray,
    textAlign: 'center',
  },
  quickAccessSection: {
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
    borderLeftWidth: 4,
  },
  cardPrimary: {
    borderLeftColor: colors.primary,
  },
  cardSecondary: {
    borderLeftColor: colors.lightBlue,
  },
  cardIconContainer: {
    backgroundColor: colors.lightGray,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.mediumGray,
    lineHeight: 20,
  },
  cardBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  logoutButton: {
    marginHorizontal: 24,
    marginBottom: 40,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.warning,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutButtonText: {
    color: colors.warning,
    fontWeight: '600',
    fontSize: 16,
  },
});