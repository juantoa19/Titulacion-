import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
<<<<<<< HEAD
  Dimensions,
  Easing,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/_AuthContext'; 
=======
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/_AuthContext';
>>>>>>> cd69528c19660d53c85ba95a0d01216fb434a585
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import loginStyles from './styles/login.styles';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });

  const { login } = useAuth();

  // Animaciones avanzadas
  const titleAnim = React.useRef(new Animated.Value(0)).current;
  const formAnim = React.useRef(new Animated.Value(0)).current;
  const logoRotate = React.useRef(new Animated.Value(0)).current;
  const buttonShineAnim = React.useRef(new Animated.Value(0)).current;
  const floatingAnim1 = React.useRef(new Animated.Value(0)).current;
  const floatingAnim2 = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación del logo giratorio
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 20000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación del brillo del botón
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonShineAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animaciones flotantes
    Animated.parallel([
      Animated.spring(titleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(formAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(floatingAnim1, {
        toValue: 1,
        tension: 40,
        friction: 5,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.spring(floatingAnim2, {
        toValue: 1,
        tension: 40,
        friction: 5,
        delay: 200,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
<<<<<<< HEAD
=======

>>>>>>> cd69528c19660d53c85ba95a0d01216fb434a585
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'Credenciales incorrectas o error de conexión');
      setLoading(false);
    }
  };

  const handleFocus = (field: string) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const titleScale = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1]
  });

  const formTranslateY = formAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0]
  });

  const logoRotation = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const buttonShinePosition = buttonShineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, width + 100]
  });

  const floatingTranslateY1 = floatingAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0]
  });

  const floatingTranslateY2 = floatingAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [70, 0]
  });

  return (
    <KeyboardAvoidingView
      style={loginStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Fondo con gradiente */}
      <LinearGradient
        colors={['#ffffff', '#f8fafc', '#e0f2fe']}
        style={loginStyles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Elementos flotantes animados */}
      <View style={loginStyles.floatingElements}>
        <Animated.View 
          style={[
            loginStyles.floatingShape1,
            { transform: [{ translateY: floatingTranslateY1 }] }
          ]} 
        />
        <Animated.View 
          style={[
            loginStyles.floatingShape2,
            { transform: [{ translateY: floatingTranslateY2 }] }
          ]} 
        />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={loginStyles.inner}>
            <View style={loginStyles.header}>
              {/* Logo animado giratorio */}
              <Animated.View 
                style={[
                  loginStyles.logoContainer,
                  { transform: [{ rotate: logoRotation }] }
                ]}
              >
                <View style={loginStyles.logoInner}>
                  <Text style={loginStyles.logoText}>CHM</Text>
                </View>
              </Animated.View>

              <Animated.Text
                style={[
                  loginStyles.title,
                  { 
                    transform: [{ scale: titleScale }],
                    opacity: titleAnim 
                  }
                ]}
              >
                Bienvenido de Nuevo
              </Animated.Text>
              <Text style={loginStyles.subtitle}>
                Ingresa tus credenciales para continuar
              </Text>
            </View>

            <Animated.View
              style={[
                loginStyles.formContainer,
                { 
                  transform: [{ translateY: formTranslateY }],
                  opacity: formAnim 
                }
              ]}
            >
              {/* Campo de email con ícono */}
              <View style={loginStyles.inputContainer}>
                <Text style={loginStyles.inputLabel}>
                  <Ionicons name="mail-outline" size={18} color="#10518b" /> 
                  {' '}Correo electrónico
                </Text>
                <View style={loginStyles.inputIconContainer}>
                  <Ionicons name="mail" size={24} color="#5faeee" />
                </View>
                <TextInput
                  style={[
                    loginStyles.input,
                    isFocused.email && loginStyles.inputFocused
                  ]}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  editable={!loading}
                />
              </View>

              {/* Campo de contraseña con ícono */}
              <View style={loginStyles.inputContainer}>
                <Text style={loginStyles.inputLabel}>
                  <Ionicons name="lock-closed-outline" size={18} color="#10518b" /> 
                  {' '}Contraseña
                </Text>
                <View style={loginStyles.inputIconContainer}>
                  <Ionicons name="lock-closed" size={24} color="#5faeee" />
                </View>
                <TextInput
                  style={[
                    loginStyles.input,
                    isFocused.password && loginStyles.inputFocused
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  editable={!loading}
                />
              </View>

              {/* Botón con gradiente y efecto shine */}
              <TouchableOpacity
                style={[
                  loginStyles.button,
                  loading && loginStyles.buttonDisabled,
                  (!email || !password) && loginStyles.buttonDisabled
                ]}
<<<<<<< HEAD
                onPress={handleLogin}
                disabled={loading || !email || !password}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#5faeee', '#3b8fd9', '#10518b']}
                  style={loginStyles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                
                {/* Efecto shine animado */}
                <Animated.View 
                  style={[
                    loginStyles.buttonShine,
                    { transform: [{ translateX: buttonShinePosition }] }
                  ]} 
                />
                
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="large" />
                ) : (
                  <Text style={loginStyles.buttonText}>
                    <Ionicons name="arrow-forward" size={22} color="#ffffff" /> 
                    {'  '}INICIAR SESIÓN
                  </Text>
                )}
=======
                placeholder="tu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Contraseña</Text>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    isFocused.password && styles.inputFocused
                  ]}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                loading && styles.buttonDisabled,
                (!email || !password) && styles.buttonDisabled
              ]}
              onPress={handleLogin}
              disabled={loading || !email || !password}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿Trabajas aquí? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={styles.registerLink}>Regístrate aquí</Text>
>>>>>>> cd69528c19660d53c85ba95a0d01216fb434a585
              </TouchableOpacity>

              {/* Sección de credenciales de prueba */}
              <View style={loginStyles.demoContainer}>
                <Text style={loginStyles.demoTitle}>
                  <Ionicons name="key-outline" size={18} color="#10518b" /> 
                  {' '}DEMO: Usa estas credenciales
                </Text>
                <Text style={loginStyles.demoText}>
                  👑 admin@proyecto.com • password: password123
                </Text>
                <Text style={[loginStyles.demoText, { fontSize: 12, marginTop: 8 }]}>
                  <Ionicons name="information-circle-outline" size={12} /> 
                  {' '}Estas credenciales son solo para pruebas
                </Text>
              </View>

              {/* Enlace de registro */}
              <View style={loginStyles.registerContainer}>
                <Text style={loginStyles.registerText}>
                  ¿Eres nuevo aquí?
                </Text>
                <TouchableOpacity 
                  onPress={() => router.push('/auth/register')}
                  disabled={loading}
                  activeOpacity={0.6}
                >
                  <LinearGradient
                    colors={['rgba(16, 81, 139, 0.1)', 'rgba(95, 174, 238, 0.2)']}
                    style={loginStyles.registerLink}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={{
                      color: '#10518b',
                      fontWeight: '800',
                      fontSize: 16,
                    }}>
                      <Ionicons name="person-add" size={16} /> 
                      {' '}Crear Cuenta
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
<<<<<<< HEAD
}
=======
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputFocused: {
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  demoContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#64748b',
    fontSize: 14,
  },
  registerLink: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 14,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  passwordInput: {
    flex: 1,
    paddingRight: 50, // espacio para el icono
  },

  eyeButton: {
    position: 'absolute',
    right: 16,
  },

  eyeText: {
    fontSize: 18,
  },
});
>>>>>>> cd69528c19660d53c85ba95a0d01216fb434a585
