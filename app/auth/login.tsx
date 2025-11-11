import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useAuth } from '../context/_AuthContext';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });
  
  const { login } = useAuth();

  // Animaciones
  const titleAnim = React.useRef(new Animated.Value(0)).current;
  const formAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.spring(titleAnim, {
        toValue: 1,
        tension: 20,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(formAnim, {
        toValue: 1,
        tension: 20,
        friction: 8,
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
      await login(email, password);
      
      const userRole = email.includes('admin') ? 'admin' : 
                      email.includes('tech') ? 'technician' : 'user';
      
      const path =
        userRole === 'admin' ? '/admin' :
        userRole === 'technician' ? '/technician/dashboard' :
        '/user/dashboard';

      router.replace(path as any);
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas');
    } finally {
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
    outputRange: [0.8, 1]
  });

  const formTranslateY = formAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0]
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {/* Header con gradiente */}
          <View style={styles.header}>
            <Animated.Text 
              style={[
                styles.title,
                {
                  transform: [{ scale: titleScale }]
                }
              ]}
            >
              Bienvenido
            </Animated.Text>
            <Text style={styles.subtitle}>
              Inicia sesión en tu cuenta
            </Text>
          </View>

          <Animated.View 
            style={[
              styles.formContainer,
              {
                transform: [{ translateY: formTranslateY }]
              }
            ]}
          >
            {/* Input de Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Correo electrónico</Text>
              <TextInput 
                style={[
                  styles.input,
                  isFocused.email && styles.inputFocused
                ]}
                placeholder="tu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
              />
            </View>

            {/* Input de Contraseña */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <TextInput 
                style={[
                  styles.input,
                  isFocused.password && styles.inputFocused
                ]}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
              />
            </View>

            {/* Botón de Login */}
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

            {/* Texto de demo */}
            <View style={styles.demoContainer}>
              <Text style={styles.demoTitle}>Credenciales de prueba:</Text>
              <Text style={styles.demoText}>• admin@test.com</Text>
              <Text style={styles.demoText}>• tech@test.com</Text>
              <Text style={styles.demoText}>• user@test.com</Text>
            </View>

            {/* Link de registro */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={styles.registerLink}>Regístrate aquí</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
});