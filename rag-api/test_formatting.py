#!/usr/bin/env python3
"""
Test script to verify bullet point formatting works correctly
"""

from rag_model import format_bullet_points

def test_formatting():
    """Test the formatting function with various input formats"""
    
    # Test case 1: The exact issue the user is experiencing
    test_input_1 = """- There are two breakdown mechanisms in a reverse-biased P-N junction: avalanche breakdown and Zener breakdown. - In avalanche breakdown, minority carriers gain kinetic energy under reverse bias. - At a high enough reverse voltage (e.g., 5V or more), this energy allows them to knock electrons from covalent bonds. - This collision liberates electrons, leading to a breakdown. - Zener breakdown occurs in diodes with wide depletion layers. - Zener diodes have a negative temperature coefficient, while avalanche diodes have a positive temperature coefficient. - Diodes with breakdown voltages around 5V have a zero temperature coefficient. - Breakdown is reversible and harmless if the safe operating temperature is maintained."""
    
    print("Test Case 1: Concatenated bullet points in one paragraph")
    print("Input:")
    print(test_input_1)
    print("\nOutput:")
    print(format_bullet_points(test_input_1))
    print("\n" + "="*80 + "\n")
    
    # Test case 2: Mixed format (some on separate lines, some concatenated)
    test_input_2 = """- First point here.
- Second point here. - Third point here. - Fourth point here.
- Fifth point here."""
    
    print("Test Case 2: Mixed format")
    print("Input:")
    print(test_input_2)
    print("\nOutput:")
    print(format_bullet_points(test_input_2))
    print("\n" + "="*80 + "\n")
    
    # Test case 3: Already properly formatted
    test_input_3 = """- First point here.
- Second point here.
- Third point here."""
    
    print("Test Case 3: Already properly formatted")
    print("Input:")
    print(test_input_3)
    print("\nOutput:")
    print(format_bullet_points(test_input_3))
    print("\n" + "="*80 + "\n")
    
    # Test case 4: No bullet points, just text
    test_input_4 = """There are two breakdown mechanisms in a reverse-biased P-N junction: avalanche breakdown and Zener breakdown. In avalanche breakdown, minority carriers gain kinetic energy under reverse bias. At a high enough reverse voltage (e.g., 5V or more), this energy allows them to knock electrons from covalent bonds."""
    
    print("Test Case 4: No bullet points, just text")
    print("Input:")
    print(test_input_4)
    print("\nOutput:")
    print(format_bullet_points(test_input_4))

if _name_ == "_main_":
    test_formatting()