/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		boxShadow: {
  			xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'var(--background)',
  			foreground: {
  				DEFAULT: 'var(--foreground)',
  				alt: 'var(--foreground-alt)'
  			},
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)',
  				hover: 'var(--primary-hover)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)',
  				hover: 'var(--secondary-hover)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)',
  				0: 'var(--accent-0)',
  				2: 'var(--accent-2)',
  				3: 'var(--accent-3)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)',
  				subtle: 'var(--destructive-subtle)',
  				border: 'var(--destructive-border)'
  			},
  			border: {
  				DEFAULT: 'var(--border)',
  				0: 'var(--border-0)',
  				1: 'var(--border-1)',
  				3: 'var(--border-3)',
  				4: 'var(--border-4)',
  				5: 'var(--border-5)'
  			},
  			input: 'var(--input)',
  			ring: {
  				DEFAULT: 'var(--ring)',
  				error: 'var(--ring-error)'
  			},
  			ghost: {
  				DEFAULT: 'var(--ghost)',
  				hover: 'var(--ghost-hover)',
  				foreground: 'var(--ghost-foreground)'
  			},
  			outline: {
  				DEFAULT: 'var(--outline)',
  				hover: 'var(--outline-hover)',
  				active: 'var(--outline-active)'
  			},
  			backdrop: 'var(--backdrop)',
  			'mid-alt': 'var(--mid-alt)',
  			'body-background': 'var(--body-background)',
  			sidebar: {
  				DEFAULT: 'var(--sidebar)',
  				foreground: 'var(--sidebar-foreground)',
  				accent: 'var(--sidebar-accent)',
  				'accent-foreground': 'var(--sidebar-accent-foreground)',
  				primary: 'var(--sidebar-primary)',
  				'primary-foreground': 'var(--sidebar-primary-foreground)',
  				border: 'var(--sidebar-border)',
  				ring: 'var(--sidebar-ring)'
  			},
  			chart: {
  				'1': 'var(--chart-1)',
  				'2': 'var(--chart-2)',
  				'3': 'var(--chart-3)',
  				'4': 'var(--chart-4)',
  				'5': 'var(--chart-5)'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate')],
};
