// app/admin/styles/admin.styles.ts
import { StyleSheet } from 'react-native';

const colors = {
  primary: '#10518b',     // Azul principal
  dark: '#343433',        // Gris oscuro
  white: '#ffffff',       // Blanco
  lightBlue: '#5faee3',   // Azul claro
  background: '#f8fafc',  // Fondo claro
  lightGray: '#f1f5f9',   // Gris muy claro
  mediumGray: '#94a3b8',  // Gris medio
  success: '#3bb273',     // Verde para estadísticas
  warning: '#ffdf2b',     // Amarillo/naranja
};

export default StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  title: { 
    fontSize: 32, 
    fontWeight: '800', 
    color: colors.white, 
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  subtitle: { 
    fontSize: 18, 
    color: colors.lightBlue, 
    opacity: 0.9,
  },
  menuContainer: { 
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardUsers: {
    borderLeftWidth: 4,
    borderLeftColor: colors.lightBlue,
  },
  cardAssignments: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  cardReports: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  cardIconContainer: {
    backgroundColor: colors.lightGray,
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: colors.dark, 
    marginBottom: 4,
  },
  cardDesc: { 
    fontSize: 14, 
    color: colors.mediumGray,
    lineHeight: 20,
  },
  cardArrow: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '300',
    opacity: 0.7,
  },
  statsContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.mediumGray,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  logoutButton: { 
    marginVertical: 40,
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#ef4444',
    borderRadius: 12,
    minWidth: 180,
  },
  logoutText: { 
    color: '#ef4444', 
    fontSize: 16, 
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});