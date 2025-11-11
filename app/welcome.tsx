import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  // Animación: la pantalla comienza fuera (abajo) y entra con spring
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Cuando carga, anima la entrada
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        bounciness: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const goToLogin = () => {
    // Al presionar botón, anima salida hacia arriba
    Animated.timing(slideAnim, {
      toValue: -height,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Después navega a login
      router.replace('auth/login' as any);
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      {/* Sección superior: título */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Bienvenido a SIS</Text>
        <Text style={styles.subtitle}>Sistema de Infraestructura</Text>
      </View>

      {/* Sección central: imagen */}
      <View style={styles.imageSection}>
        <Image
          source={require('../assets/images/react-logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Sección inferior: descripción + botón */}
      <View style={styles.footerSection}>
        <Text style={styles.description}>
          Administra tus tickets y mantén la infraestructura en perfecto estado. Accede como
          administrador, técnico o usuario para ver tu panel personalizado.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={goToLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Siguiente</Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color="#fff"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  headerSection: {
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '60%',
    height: '60%',
  },
  footerSection: {
    paddingBottom: 40,
    gap: 20,
  },
  description: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
