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
  Dimensions,
  Easing,
  ScrollView,
  Image // IMPORTANTE: Importar Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/_AuthContext'; 
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import loginStyles from './styles/login.styles';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para ver/ocultar contraseña
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });

  const { login } = useAuth();

  // Animaciones avanzadas
  const titleAnim = React.useRef(new Animated.Value(0)).current;
  const formAnim = React.useRef(new Animated.Value(0)).current;
  // NOTA: Se eliminó logoRotate ref
  const buttonShineAnim = React.useRef(new Animated.Value(0)).current;
  const floatingAnim1 = React.useRef(new Animated.Value(0)).current;
  const floatingAnim2 = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // NOTA: Se eliminó la animación Animated.loop del logo

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

    // Animaciones flotantes y de entrada
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

  // NOTA: Se eliminó logoRotation interpolate

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
              
              {/* --- Logo Imagen --- */}
              <View style={loginStyles.logoContainer}>
                {/* Asegúrate de que esta ruta sea correcta para tu proyecto */}
                <Image 
                  source={require('../../assets/images/chm_logo.png')} 
                  style={loginStyles.logoImage}
                  resizeMode="contain"
                />
              </View>
              {/* -------------------------------------- */}

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

              {/* --- CAMBIO: Campo de contraseña con opción ver/ocultar --- */}
              <View style={loginStyles.inputContainer}>
                <Text style={loginStyles.inputLabel}>
                  <Ionicons name="lock-closed-outline" size={18} color="#10518b" /> 
                  {' '}Contraseña
                </Text>
                
                {/* Ícono de candado (Izquierda) */}
                <View style={loginStyles.inputIconContainer}>
                  <Ionicons name="lock-closed" size={24} color="#5faeee" />
                </View>

                <TextInput
                  style={[
                    loginStyles.input,
                    isFocused.password && loginStyles.inputFocused,
                    { paddingRight: 55 } // Espacio extra para el ojo
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  
                  // Lógica de visibilidad
                  secureTextEntry={!showPassword}
                  
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  editable={!loading}
                />

                {/* Ícono de ojo (Derecha) */}
                <TouchableOpacity
                  style={loginStyles.eyeIconContainer}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={24} 
                    color="#94a3b8"
                  />
                </TouchableOpacity>
              </View>
              {/* ----------------------------------------------------- */}

              {/* Botón con gradiente y efecto shine */}
              <TouchableOpacity
                style={[
                  loginStyles.button,
                  loading && loginStyles.buttonDisabled,
                  (!email || !password) && loginStyles.buttonDisabled
                ]}
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
}